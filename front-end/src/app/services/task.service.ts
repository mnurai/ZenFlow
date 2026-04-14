import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStats } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/`);
  }

  createTask(data: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks/`, data);
  }

  updateTask(id: number, data: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${id}/`, data);
  }

  patchTask(id: number, data: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}/`, data);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}/`);
  }

  getStats(): Observable<TaskStats> {
    return this.http.get<TaskStats>(`${this.baseUrl}/tasks/stats/`);
  }
}
