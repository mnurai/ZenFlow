import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinService } from '../../services/checkin.service';
import { Recommendation } from '../../models/interfaces';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  rec: Recommendation | null = null;
  error = '';
  loading = true;

  constructor(private checkinService: CheckinService) {}

  ngOnInit(): void {
    this.checkinService.getRecommendation().subscribe({
      next: r => { this.rec = r; this.loading = false; },
      error: (err) => {
        this.error = err.status === 404
          ? 'No check-in found. Please complete a Daily Check-in first.'
          : 'Failed to load recommendation.';
        this.loading = false;
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
}
