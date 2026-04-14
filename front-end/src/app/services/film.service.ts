import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getFilms(): Observable<Film[]> {
    return this.http.get<Film[]>(`${this.baseUrl}/films/`);
  }

  createFilm(data: Partial<Film>): Observable<Film> {
    return this.http.post<Film>(`${this.baseUrl}/films/`, data);
  }

  patchFilm(id: number, data: Partial<Film>): Observable<Film> {
    return this.http.patch<Film>(`${this.baseUrl}/films/${id}/`, data);
  }

  deleteFilm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/films/${id}/`);
  }
}
