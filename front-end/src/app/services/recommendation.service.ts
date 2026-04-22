import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Recommendation } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getRecommendation(): Observable<Recommendation> {
    return this.http.get<Recommendation>(`${this.baseUrl}/recommendation/`).pipe(
      catchError(err => {
        console.error('Failed to load recommendation', err);
        return throwError(() => err);
      })
    );
  }
}
