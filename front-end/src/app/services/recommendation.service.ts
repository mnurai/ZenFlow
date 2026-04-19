import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recommendation } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getRecommendation(): Observable<Recommendation> {
    return this.http.get<Recommendation>(`${this.baseUrl}/recommendation/`);
  }
}
