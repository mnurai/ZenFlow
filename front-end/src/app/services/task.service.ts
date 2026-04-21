import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task, TaskStats } from '../models/interfaces';

export interface CreateTaskRequest {
  title: string;
  quadrant: string;
  is_done?: boolean;
}

export interface UpdateTaskRequest {
  title?: string;
  quadrant?: string;
  is_done?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/`).pipe(
      catchError(err => {
        console.error('Failed to load tasks', err);
        return throwError(() => err);
      })
    );
  }

  createTask(data: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks/`, data).pipe(
      catchError(err => {
        console.error('Failed to create task', err);
        return throwError(() => err);
      })
    );
  }

  updateTask(id: number, data: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${id}/`, data).pipe(
      catchError(err => {
        console.error(`Failed to update task with id ${id}`, err);
        return throwError(() => err);
      })
    );
  }

  patchTask(id: number, data: UpdateTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}/`, data).pipe(
      catchError(err => {
        console.error(`Failed to patch task with id ${id}`, err);
        return throwError(() => err);
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}/`).pipe(
      catchError(err => {
        console.error(`Failed to delete task with id ${id}`, err);
        return throwError(() => err);
      })
    );
  }

  getStats(): Observable<TaskStats> {
    return this.http.get<TaskStats>(`${this.baseUrl}/tasks/stats/`).pipe(
      catchError(err => {
        console.error('Failed to load task stats', err);
        return throwError(() => err);
      })
    );
  }
}
