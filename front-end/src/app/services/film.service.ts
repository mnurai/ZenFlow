import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Film } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getFilms(): Observable<Film[]> {
    return this.http.get<Film[]>(`${this.baseUrl}/films/`).pipe(
      catchError(err => {
        console.error('Failed to load films', err);
        return throwError(() => err);
      })
    );
  }

  createFilm(data: Partial<Film>): Observable<Film> {
    return this.http.post<Film>(`${this.baseUrl}/films/`, data).pipe(
      catchError(err => {
        console.error('Failed to create film', err);
        return throwError(() => err);
      })
    );
  }

  patchFilm(id: number, data: Partial<Film>): Observable<Film> {
    return this.http.patch<Film>(`${this.baseUrl}/films/${id}/`, data).pipe(
      catchError(err => {
        console.error(`Failed to patch film with id ${id}`, err);
        return throwError(() => err);
      })
    );
  }

  deleteFilm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/films/${id}/`).pipe(
      catchError(err => {
        console.error(`Failed to delete film with id ${id}`, err);
        return throwError(() => err);
      })
    );
  }
}
