import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { Goal, CreateGoalRequest } from '../../models/goal.model';

@Component({
  selector: 'app-goals-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="goals-container">
      <div class="goals-header">
        <h2>Your Goals</h2>
        <button class="btn btn-primary" (click)="showCreateForm = true">
          ➕ Add New Goal
        </button>
      </div>

      <!-- Create Goal Form -->
      <div *ngIf="showCreateForm" class="create-form-overlay">
        <div class="create-form">
          <h3>Create New 30-Day Challenge</h3>
          <form (ngSubmit)="createGoal()" #goalForm="ngForm">
            <div class="form-group">
              <label for="title">Goal Title *</label>
              <input 
                type="text" 
                id="title" 
                name="title"
                [(ngModel)]="newGoal.title" 
                required
                placeholder="e.g., Exercise daily, Read 30 minutes"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label for="description">Description (optional)</label>
              <textarea 
                id="description" 
                name="description"
                [(ngModel)]="newGoal.description" 
                placeholder="Add more details about your goal..."
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelCreate()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!goalForm.valid || isCreating">
                {{ isCreating ? 'Creating...' : 'Start Challenge' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Goals List -->
      <div class="goals-grid" *ngIf="goals.length > 0; else noGoals">
        <div 
          *ngFor="let goal of goals" 
          class="goal-card"
          (click)="viewGoal(goal.id)"
        >
          <div class="goal-header">
            <h3>{{ goal.title }}</h3>
            <span class="goal-date">{{ formatDate(goal.start_date) }}</span>
          </div>
          
          <p *ngIf="goal.description" class="goal-description">
            {{ goal.description }}
          </p>
          
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="getProgressPercentage(goal)"></div>
            </div>
            <span class="progress-text">{{ getProgressPercentage(goal) }}% complete</span>
          </div>
          
          <div class="goal-actions">
            <button class="btn btn-small btn-primary" (click)="viewGoal(goal.id)">
              View Details
            </button>
            <button class="btn btn-small btn-danger" (click)="deleteGoal(goal.id, $event)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <ng-template #noGoals>
        <div class="no-goals">
          <div class="no-goals-icon">🎯</div>
          <h3>No goals yet!</h3>
          <p>Start your first 30-day challenge to build better habits.</p>
          <button class="btn btn-primary" (click)="showCreateForm = true">
            Create Your First Goal
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .goals-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .goals-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .goals-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.8rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .create-form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .create-form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .create-form h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .goal-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .goal-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .goal-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.3rem;
      flex: 1;
    }

    .goal-date {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .goal-description {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .goal-progress {
      margin-bottom: 1.5rem;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.9rem;
      color: #666;
      font-weight: 600;
    }

    .goal-actions {
      display: flex;
      gap: 0.75rem;
    }

    .no-goals {
      text-align: center;
      background: white;
      padding: 3rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .no-goals-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .no-goals h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .no-goals p {
      color: #666;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .goals-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .goals-grid {
        grid-template-columns: 1fr;
      }

      .create-form {
        width: 95%;
        margin: 1rem;
      }
    }
  `]
})
export class GoalsListComponent implements OnInit {
  goals: Goal[] = [];
  showCreateForm = false;
  isCreating = false;
  newGoal: CreateGoalRequest = {
    title: '',
    description: ''
  };

  constructor(
    private goalService: GoalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.goalService.getGoals().subscribe({
      next: (goals) => {
        this.goals = goals;
      },
      error: (error) => {
        console.error('Error loading goals:', error);
      }
    });
  }

  createGoal(): void {
    if (!this.newGoal.title.trim()) return;

    this.isCreating = true;
    this.goalService.createGoal(this.newGoal).subscribe({
      next: (goal) => {
        this.goals.unshift(goal);
        this.showCreateForm = false;
        this.newGoal = { title: '', description: '' };
        this.isCreating = false;
      },
      error: (error) => {
        console.error('Error creating goal:', error);
        this.isCreating = false;
      }
    });
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.newGoal = { title: '', description: '' };
  }

  viewGoal(goalId: string): void {
    this.router.navigate(['/goals', goalId]);
  }

  deleteGoal(goalId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      this.goalService.deleteGoal(goalId).subscribe({
        next: () => {
          this.goals = this.goals.filter(g => g.id !== goalId);
        },
        error: (error) => {
          console.error('Error deleting goal:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getProgressPercentage(goal: Goal): number {
    const startDate = new Date(goal.start_date);
    const endDate = new Date(goal.end_date);
    const today = new Date();
    
    if (today < startDate) return 0;
    if (today > endDate) return 100;
    
    const totalDays = 30;
    const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.round((daysElapsed / totalDays) * 100), 100);
  }
}
