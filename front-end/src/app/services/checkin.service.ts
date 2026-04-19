import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckIn, Recommendation } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class CheckinService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  submitCheckIn(data: Partial<CheckIn>): Observable<CheckIn> {
    return this.http.post<CheckIn>(`${this.baseUrl}/checkins/`, data);
  }

  getHistory(): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.baseUrl}/checkins/`);
  }

  getLatest(): Observable<CheckIn> {
    return this.http.get<CheckIn>(`${this.baseUrl}/checkins/latest/`);
  }
}
