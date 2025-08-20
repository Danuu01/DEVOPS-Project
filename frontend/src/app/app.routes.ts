import { Routes } from '@angular/router';
import { GoalsListComponent } from './components/goals-list/goals-list.component';
import { GoalDetailComponent } from './components/goal-detail/goal-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/goals', pathMatch: 'full' },
  { path: 'goals', component: GoalsListComponent },
  { path: 'goals/:id', component: GoalDetailComponent }
];
