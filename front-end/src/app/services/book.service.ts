import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class BookService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/books/`);
  }

  createBook(data: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/books/`, data);
  }

  patchBook(id: number, data: Partial<Book>): Observable<Book> {
    return this.http.patch<Book>(`${this.baseUrl}/books/${id}/`, data);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}/`);
  }
}
