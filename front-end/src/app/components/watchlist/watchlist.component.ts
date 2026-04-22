import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmService } from '../../services/film.service';
import { Film } from '../../models/interfaces';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  films: Film[] = [];

  newTitle = '';
  newDirector = '';
  newGenre: Film['genre'] = 'comedy';
  newStatus: Film['status'] = 'want_to_watch';

  error = '';

  genres: Film['genre'][] = ['thriller', 'drama', 'comedy', 'documentary', 'scifi'];

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.filmService.getFilms().subscribe({
      next: f => this.films = f,
      error: () => this.error = 'Failed to load films.'
    });
  }

  onAdd(): void {
    if (!this.newTitle.trim()) return;

    this.filmService.createFilm({
      title: this.newTitle.trim(),
      director: this.newDirector.trim() || null,
      genre: this.newGenre,
      status: this.newStatus,
      rating: null
    }).subscribe({
      next: f => {
        this.films.push(f);
        this.newTitle = '';
        this.newDirector = '';
      },
      error: () => this.error = 'Failed to add film.'
    });
  }

  onChangeStatus(film: Film, status: Film['status']): void {
    if (!film.id) return;

    this.filmService.patchFilm(film.id, { status }).subscribe({
      next: updated => {
        const i = this.films.findIndex(f => f.id === film.id);
        if (i !== -1) this.films[i] = updated;
      },
      error: () => this.error = 'Failed to update status.'
    });
  }

  onRate(film: Film, star: number): void {
    if (!film.id) return;

    const newRating = film.rating === star ? null : star;

    this.filmService.patchFilm(film.id, { rating: newRating }).subscribe({
      next: updated => {
        const i = this.films.findIndex(f => f.id === film.id);
        if (i !== -1) this.films[i] = updated;
      },
      error: () => this.error = 'Failed to update rating.'
    });
  }

  onDelete(id: number): void {
    this.filmService.deleteFilm(id).subscribe({
      next: () => this.films = this.films.filter(f => f.id !== id),
      error: () => this.error = 'Failed to delete film.'
    });
  }

  get genreStats(): { genre: string; count: number }[] {
    const counts: Record<string, number> = {};
    this.films.forEach(f => {
      counts[f.genre] = (counts[f.genre] || 0) + 1;
    });
    return Object.entries(counts).map(([genre, count]) => ({ genre, count }));
  }

  capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }
}
