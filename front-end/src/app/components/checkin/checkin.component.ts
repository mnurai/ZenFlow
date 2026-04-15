import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckinService } from '../../services/checkin.service';
import { CheckIn } from '../../models/interfaces';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent {
  sleepHours = 7;
  foodQuality = 3;
  energyLevel = 3;
  mood = 3;
  notes = '';

  result: CheckIn | null = null;
  error = '';
  loading = false;

  moodEmojis = ['😩', '😕', '😐', '🙂', '😄'];

  constructor(private checkinService: CheckinService) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.checkinService.createCheckin({
      sleep_hours: this.sleepHours,
      food_quality: this.foodQuality,
      energy_level: this.energyLevel,
      mood: this.mood,
      notes: this.notes
    }).subscribe({
      next: res => { this.result = res; this.loading = false; },
      error: () => { this.error = 'Failed to save check-in. Please try again.'; this.loading = false; }
    });
  }

  get sleepPts(): number { return Math.round(this.sleepHours / 12 * 40); }
  get moodPts(): number { return Math.round(this.mood / 5 * 30); }
  get foodPts(): number { return Math.round(this.foodQuality / 5 * 15); }
  get energyPts(): number { return Math.round(this.energyLevel / 5 * 15); }

  get capacityLabel(): string {
    if (!this.result) return '';
    const s = this.result.score ?? 0;
    if (s >= 65) return 'High capacity';
    if (s >= 40) return 'Medium capacity';
    return 'Low capacity';
  }

  get capacityClass(): string {
    if (!this.result) return '';
    const s = this.result.score ?? 0;
    if (s >= 65) return 'high';
    if (s >= 40) return 'medium';
    return 'low';
  }
}
