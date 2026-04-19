import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/interfaces';

@Component({
  selector: 'app-booklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.css']
})
export class BooklistComponent implements OnInit {
  books: Book[] = [];
  
  newTitle = '';
  newAuthor = '';
  newYear: number | null = null;
  newMoodTag: Book['mood_tag'] = 'light';
  newStatus: Book['status'] = 'want_to_read';
  
  errorMessage = '';
  moodTags: Book['mood_tag'][] = ['light', 'educational', 'deep', 'fiction'];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: b => this.books = b,
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });
  }

  onAdd(): void {
    if (!this.newTitle.trim()) return;

    this.bookService.createBook({
      title: this.newTitle.trim(),
      author: this.newAuthor.trim(),
      
      year: this.newYear,
      mood_tag: this.newMoodTag,
      status: this.newStatus

    }).subscribe({
      next: b => {
        this.books.push(b);
        this.resetForm();
      },
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });

  }

  private resetForm(): void {
    this.newTitle = '';
    this.newAuthor = '';
    this.newYear = null;
    this.newMoodTag = 'light';

  }

  onDelete(id: number): void {
    this.bookService.deleteBook(id).subscribe({
      next: () => this.books = this.books.filter(b => b.id !== id),
      error: () => this.errorMessage = 'Failed to load. Please try again.'

    });
  }

  get moodStats(): { tag: string; count: number }[] {
    const counts: Record<string, number> = {};
    this.books.forEach(b => {
      counts[b.mood_tag] = (counts[b.mood_tag] || 0) + 1;
    });
    return Object.entries(counts).map(([tag, count]) => ({ tag, count }));
  }

  capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }
}
