import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinService } from '../../services/checkin.service';
import { CheckIn } from '../../models/interfaces';

@Component({
  selector: 'app-checkin-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkin-history.component.html',
  styleUrls: ['./checkin-history.component.css']
})
export class CheckinHistoryComponent implements OnInit {
  history: CheckIn[] = [];
  errorMessage: string = '';

  constructor(private checkinService: CheckinService) {}

  ngOnInit(): void {
    this.checkinService.getHistory().subscribe({
      next: data => this.history = data,
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });
  }

  getCapacityLabel(score: number | undefined): string {
    if (score === undefined) return '—';
    if (score >= 65) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }

  getCapacityClass(score: number | undefined): string {
    if (score === undefined) return '';
    if (score >= 65) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}
