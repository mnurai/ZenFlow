import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecommendationService } from '../../services/recommendation.service';
import { TaskService } from '../../services/task.service';
import { Recommendation, Task } from '../../models/interfaces';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  rec: Recommendation | null = null;
  errorMessage = '';
  loading = true;

  constructor(
    private recommendationService: RecommendationService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.recommendationService.getRecommendation().subscribe({
      next: r => {
        this.rec = r;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.status === 404
          ? 'No check-in found. Please complete a Daily Check-in first.'
          : 'Failed to load recommendation.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get tierClass(): string {
    if (!this.rec) return '';
    return this.rec.capacity_tier.toLowerCase();
  }

  quadrantLabel(q: string): string {
    const map: Record<string, string> = {
      UI: 'Urgent · Important', UNI: 'Urgent · Not imp.',
      NUI: 'Not urgent · Imp.', NUNI: 'Not urgent · Not imp.'
    };
    return map[q] || q;
  }

  dotClass(q: string): string {
    const map: Record<string, string> = { UI: 'dot-ui', UNI: 'dot-uni', NUI: 'dot-nui', NUNI: 'dot-nuni' };
    return map[q] || '';
  }

  onToggleTask(task: Task): void {
    if (!task.id) return;
    this.taskService.patchTask(task.id, { is_done: !task.is_done }).subscribe({
      next: updated => {
        const index = this.rec?.tasks.findIndex(t => t.id === task.id);
        if (index !== -1 && this.rec) {
          this.rec.tasks[index!] = updated;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to update task.';
      }
    });
  }
}
