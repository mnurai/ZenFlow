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
  
  errorMessage = '';


  genres: Film['genre'][] = ['thriller', 'drama', 'comedy', 'documentary', 'scifi'];

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.filmService.getFilms().subscribe({
      next: f => this.films = f,
      error: () => this.errorMessage = 'Failed to load. Please try again.'
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
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });
  }

  onDelete(id: number): void {
    this.filmService.deleteFilm(id).subscribe({
      next: () => this.films = this.films.filter(f => f.id !== id),
      error: () => this.errorMessage = 'Failed to load. Please try again.'
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
