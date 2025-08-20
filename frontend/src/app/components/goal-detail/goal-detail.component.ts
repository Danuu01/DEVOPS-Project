import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { Goal, Progress, UpdateProgressRequest } from '../../models/goal.model';

@Component({
  selector: 'app-goal-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="goal-detail-container" *ngIf="goal">
      <div class="goal-header">
        <button class="btn btn-secondary" (click)="goBack()">
          ← Back to Goals
        </button>
        <h2>{{ goal.title }}</h2>
        <div class="goal-meta">
          <span class="date-range">
            {{ formatDate(goal.start_date) }} - {{ formatDate(goal.end_date) }}
          </span>
          <span class="progress-badge">
            {{ getCompletedDays() }}/30 days completed
          </span>
        </div>
      </div>

      <div class="goal-description" *ngIf="goal.description">
        <p>{{ goal.description }}</p>
      </div>

      <!-- 30-Day Calendar -->
      <div class="calendar-container">
        <h3>30-Day Challenge Calendar</h3>
        <div class="calendar-grid">
          <div 
            *ngFor="let progress of progressData; let i = index" 
            class="calendar-day"
            [class.completed]="progress.completed"
            [class.today]="isToday(progress.date)"
            [class.future]="isFuture(progress.date)"
            (click)="toggleDay(progress)"
          >
            <div class="day-number">{{ i + 1 }}</div>
            <div class="day-date">{{ formatShortDate(progress.date) }}</div>
            <div class="day-status">
              <span *ngIf="progress.completed" class="completed-icon">✓</span>
              <span *ngIf="!progress.completed && !isFuture(progress.date)" class="missed-icon">✗</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Summary -->
      <div class="progress-summary">
        <div class="summary-card">
          <h4>Current Streak</h4>
          <div class="streak-count">{{ getCurrentStreak() }}</div>
          <p>days in a row</p>
        </div>
        
        <div class="summary-card">
          <h4>Best Streak</h4>
          <div class="streak-count">{{ getBestStreak() }}</div>
          <p>days in a row</p>
        </div>
        
        <div class="summary-card">
          <h4>Completion Rate</h4>
          <div class="streak-count">{{ getCompletionRate() }}%</div>
          <p>of days completed</p>
        </div>
      </div>

      <!-- Notes Modal -->
      <div *ngIf="showNotesModal && selectedProgress" class="notes-modal-overlay">
        <div class="notes-modal">
          <h4>Add Notes for Day {{ getDayNumber(selectedProgress.date) }}</h4>
          <textarea 
            [(ngModel)]="selectedProgress.notes" 
            placeholder="Add your notes for this day..."
            class="notes-textarea"
            rows="4"
          ></textarea>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeNotesModal()">
              Cancel
            </button>
            <button class="btn btn-primary" (click)="saveNotes()">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!goal && !loading" class="not-found">
      <h3>Goal not found</h3>
      <p>The goal you're looking for doesn't exist.</p>
      <button class="btn btn-primary" (click)="goBack()">Go Back</button>
    </div>

    <div *ngIf="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading goal...</p>
    </div>
  `,
  styles: [`
    .goal-detail-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .goal-header {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      text-align: center;
    }

    .goal-header h2 {
      margin: 1rem 0;
      color: #333;
      font-size: 2.2rem;
    }

    .goal-meta {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .date-range {
      background: #667eea;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
    }

    .progress-badge {
      background: #28a745;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
    }

    .goal-description {
      background: white;
      padding: 1.5rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      text-align: center;
    }

    .goal-description p {
      margin: 0;
      color: #666;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .calendar-container {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .calendar-container h3 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
      font-size: 1.5rem;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .calendar-day {
      aspect-ratio: 1;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      background: white;
    }

    .calendar-day:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .calendar-day.completed {
      border-color: #28a745;
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }

    .calendar-day.today {
      border-color: #667eea;
      border-width: 3px;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    .calendar-day.future {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .day-number {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .day-date {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .day-status {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }

    .completed-icon {
      color: white;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .missed-icon {
      color: #dc3545;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .progress-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .summary-card h4 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.1rem;
    }

    .streak-count {
      font-size: 2.5rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .summary-card p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
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

    .notes-modal-overlay {
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

    .notes-modal {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .notes-modal h4 {
      margin: 0 0 1.5rem 0;
      color: #333;
      text-align: center;
    }

    .notes-textarea {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      resize: vertical;
      margin-bottom: 1.5rem;
    }

    .notes-textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .not-found, .loading {
      text-align: center;
      background: white;
      padding: 3rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e9ecef;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .calendar-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
      }

      .goal-meta {
        flex-direction: column;
        gap: 1rem;
      }

      .progress-summary {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GoalDetailComponent implements OnInit {
  goal: Goal | null = null;
  progressData: Progress[] = [];
  loading = true;
  showNotesModal = false;
  selectedProgress: Progress | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService
  ) {}

  ngOnInit(): void {
    const goalId = this.route.snapshot.paramMap.get('id');
    if (goalId) {
      this.loadGoal(goalId);
    }
  }

  loadGoal(goalId: string): void {
    this.loading = true;
    
    // Load goal details
    this.goalService.getGoals().subscribe({
      next: (goals) => {
        this.goal = goals.find(g => g.id === goalId) || null;
        if (this.goal) {
          this.loadProgress(goalId);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading goal:', error);
        this.loading = false;
      }
    });
  }

  loadProgress(goalId: string): void {
    this.goalService.getProgress(goalId).subscribe({
      next: (progress) => {
        this.progressData = progress;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading progress:', error);
        this.loading = false;
      }
    });
  }

  toggleDay(progress: Progress): void {
    if (this.isFuture(progress.date)) return;

    if (progress.completed) {
      // Remove completion
      progress.completed = false;
    } else {
      // Mark as completed
      progress.completed = true;
    }

    this.updateProgress(progress);
  }

  updateProgress(progress: Progress): void {
    const update: UpdateProgressRequest = {
      completed: progress.completed,
      notes: progress.notes
    };

    this.goalService.updateProgress(progress.id, update).subscribe({
      error: (error) => {
        console.error('Error updating progress:', error);
        // Revert the change on error
        progress.completed = !progress.completed;
      }
    });
  }

  addNotes(progress: Progress): void {
    this.selectedProgress = { ...progress }; // Create a copy to avoid direct reference
    this.showNotesModal = true;
  }

  saveNotes(): void {
    if (this.selectedProgress) {
      this.updateProgress(this.selectedProgress);
      this.closeNotesModal();
    }
  }

  closeNotesModal(): void {
    this.showNotesModal = false;
    this.selectedProgress = null;
  }

  goBack(): void {
    this.router.navigate(['/goals']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatShortDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }

  isToday(dateString: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  }

  isFuture(dateString: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateString > today;
  }

  getDayNumber(dateString: string): number {
    if (!this.goal) return 0;
    const startDate = new Date(this.goal.start_date);
    const currentDate = new Date(dateString);
    const diffTime = currentDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }

  getCompletedDays(): number {
    return this.progressData.filter(p => p.completed).length;
  }

  getCurrentStreak(): number {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = this.progressData.length - 1; i >= 0; i--) {
      if (this.progressData[i].completed && this.progressData[i].date <= today) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  getBestStreak(): number {
    let bestStreak = 0;
    let currentStreak = 0;
    
    for (const progress of this.progressData) {
      if (progress.completed) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return bestStreak;
  }

  getCompletionRate(): number {
    const completed = this.getCompletedDays();
    const total = this.progressData.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}
