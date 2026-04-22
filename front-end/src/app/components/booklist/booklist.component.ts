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
  newGenre: NonNullable<Book['genre']> = 'other';
  newStatus: Book['status'] = 'want_to_read';

  error = '';
  genres: NonNullable<Book['genre']>[] = ['fantasy', 'sci_fi', 'romance', 'thriller', 'mystery', 'biography', 'self_help', 'history', 'other'];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: b => this.books = b,
      error: () => this.error = 'Failed to load books.'
    });
  }

  onAdd(): void {
    if (!this.newTitle.trim()) return;

    this.bookService.createBook({
      title: this.newTitle.trim(),
      author: this.newAuthor.trim(),
      year: this.newYear,
      mood_tag: 'light',
      genre: this.newGenre,
      status: this.newStatus
    }).subscribe({
      next: b => {
        this.books.push(b);
        this.resetForm();
      },
      error: () => this.error = 'Failed to add book.'
    });
  }

  onChangeStatus(book: Book, status: Book['status']): void {
    if (!book.id) return;

    this.bookService.patchBook(book.id, { status }).subscribe({
      next: updated => {
        const i = this.books.findIndex(b => b.id === book.id);
        if (i !== -1) this.books[i] = updated;
      },
      error: () => this.error = 'Failed to update status.'
    });
  }

  onDelete(id: number): void {
    this.bookService.deleteBook(id).subscribe({
      next: () => this.books = this.books.filter(b => b.id !== id),
      error: () => this.error = 'Failed to delete book.'
    });
  }

  private resetForm(): void {
    this.newTitle = '';
    this.newAuthor = '';
    this.newYear = null;
    this.newGenre = 'other';
    this.newStatus = 'want_to_read';
  }

  genreLabel(g: string): string {
    const map: Record<string, string> = {
      fantasy: 'Fantasy', sci_fi: 'Sci-Fi', romance: 'Romance',
      thriller: 'Thriller', mystery: 'Mystery', biography: 'Biography',
      self_help: 'Self-Help', history: 'History', other: 'Other'
    };
    return map[g] || g;
  }

  get genreStats(): { genre: string; count: number }[] {
    const counts: Record<string, number> = {};
    this.books.forEach(b => {
      if (b.genre) counts[b.genre] = (counts[b.genre] || 0) + 1;
    });
    return Object.entries(counts).map(([genre, count]) => ({ genre, count }));
  }
}
