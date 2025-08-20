import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal, Progress, CreateGoalRequest, UpdateProgressRequest } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals`);
  }

  createGoal(goal: CreateGoalRequest): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals`, goal);
  }

  getProgress(goalId: string): Observable<Progress[]> {
    return this.http.get<Progress[]>(`${this.apiUrl}/goals/${goalId}/progress`);
  }

  updateProgress(progressId: string, update: UpdateProgressRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/progress/${progressId}`, update);
  }

  deleteGoal(goalId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/goals/${goalId}`);
  }
}
