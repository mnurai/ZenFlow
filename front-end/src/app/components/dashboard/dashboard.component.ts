import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CheckinService } from '../../services/checkin.service';
import { FilmService } from '../../services/film.service';
import { BookService } from '../../services/book.service';
import { Task, CheckIn, TaskStats } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username = localStorage.getItem('username') || 'User';
  today = new Date();

  tasks: Task[] = [];
  stats: TaskStats | null = null;
  latestCheckin: CheckIn | null = null;
  filmCount = 0;
  bookCount = 0;
  errorMessage = '';

  constructor(
    private taskService: TaskService,
    private checkinService: CheckinService,
    private filmService: FilmService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: t => this.tasks = t,
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });

    this.taskService.getStats().subscribe({
      next: s => this.stats = s,
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });

    this.checkinService.getLatest().subscribe({
      next: c => this.latestCheckin = c,
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });

    this.filmService.getFilms().subscribe({
      next: f => this.filmCount = f.length,
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });

    this.bookService.getBooks().subscribe({
      next: b => this.bookCount = b.length,
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });
  }

  get greeting(): string {
    const h = this.today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  get formattedDate(): string {
    return this.today.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  }

  get urgentCount(): number {
    return this.tasks.filter(t => t.quadrant === 'UI' && !t.is_done).length;
  }

  get capacityLabel(): string {
    if (!this.latestCheckin?.score) return '—';
    const s = this.latestCheckin.score;
    if (s >= 65) return 'High capacity';
    if (s >= 40) return 'Medium capacity';
    return 'Low capacity';
  }

  get capacityClass(): string {
    if (!this.latestCheckin?.score) return '';
    const s = this.latestCheckin.score;
    if (s >= 65) return 'high';
    if (s >= 40) return 'medium';
    return 'low';
  }

  quadrantLabel(q: string): string {
    const map: Record<string, string> = {
      UI: 'Urgent · Important',
      UNI: 'Urgent · Not imp.',
      NUI: 'Not urgent · Imp.',
      NUNI: 'Not urgent · Not imp.'
    };
    return map[q] || q;
  }

  quadrantClass(q: string): string {
    const map: Record<string, string> = { UI: 'tag-ui', UNI: 'tag-uni', NUI: 'tag-nui', NUNI: 'tag-nuni' };
    return map[q] || '';
  }

  onToggleDone(task: Task): void {
    if (!task.id) return;
    this.taskService.patchTask(task.id, { is_done: !task.is_done }).subscribe({
      next: updated => {
        const i = this.tasks.findIndex(t => t.id === task.id);
        if (i !== -1) this.tasks[i] = updated;
      },
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });
  }
}
