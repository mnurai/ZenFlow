import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class BookService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/books/`).pipe(
      catchError(err => {
        console.error('Failed to load books', err);
        return throwError(() => err);
      })
    );
  }

  createBook(data: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/books/`, data).pipe(
      catchError(err => {
        console.error('Failed to create book', err);
        return throwError(() => err);
      })
    );
  }

  patchBook(id: number, data: Partial<Book>): Observable<Book> {
    return this.http.patch<Book>(`${this.baseUrl}/books/${id}/`, data).pipe(
      catchError(err => {
        console.error(`Failed to patch book with id ${id}`, err);
        return throwError(() => err);
      })
    );
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}/`).pipe(
      catchError(err => {
        console.error(`Failed to delete book with id ${id}`, err);
        return throwError(() => err);
      })
    );
  }
}
