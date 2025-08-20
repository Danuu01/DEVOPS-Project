import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🎯 Goal Tracker</h1>
        <p>Track your 30-day challenges and build better habits</p>
      </header>
      
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <p>&copy; 2024 Goal Tracker. Built with Angular & Node.js</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .app-header {
      text-align: center;
      padding: 2rem 1rem;
      color: white;
      background: rgba(0, 0, 0, 0.1);
    }
    
    .app-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      font-weight: 700;
    }
    
    .app-header p {
      margin: 0;
      font-size: 1.1rem;
      opacity: 0.9;
    }
    
    .app-main {
      flex: 1;
      padding: 2rem 1rem;
    }
    
    .app-footer {
      text-align: center;
      padding: 1rem;
      color: white;
      background: rgba(0, 0, 0, 0.1);
      font-size: 0.9rem;
    }
  `]
})
export class AppComponent {
  title = 'Goal Tracker';
}
