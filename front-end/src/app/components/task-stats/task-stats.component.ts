import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskStats } from '../../models/interfaces';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-stats.component.html',
  styleUrls: ['./task-stats.component.css']
})
export class TaskStatsComponent implements OnInit {
  stats: TaskStats | null = null;
  errorMessage: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getStats().subscribe({
      next: data => this.stats = data,
      error: () => this.errorMessage = 'Failed to load. Please try again.'
    });
  }
}
