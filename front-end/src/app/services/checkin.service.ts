import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CheckIn, Recommendation } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class CheckinService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  submitCheckIn(data: Partial<CheckIn>): Observable<CheckIn> {
    return this.http.post<CheckIn>(`${this.baseUrl}/checkins/`, data).pipe(
      catchError(err => {
        console.error('Failed to submit check-in', err);
        return throwError(() => err);
      })
    );
  }

  getHistory(): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.baseUrl}/checkins/`).pipe(
      catchError(err => {
        console.error('Failed to load check-in history', err);
        return throwError(() => err);
      })
    );
  }

  getLatest(): Observable<CheckIn> {
    return this.http.get<CheckIn>(`${this.baseUrl}/checkins/latest/`).pipe(
      catchError(err => {
        console.error('Failed to load latest check-in', err);
        return throwError(() => err);
      })
    );
  }
}
