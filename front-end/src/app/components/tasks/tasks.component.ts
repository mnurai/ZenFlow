import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/interfaces';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  newTitle = '';
  newQuadrant: Task['quadrant'] = 'UI';
  error = '';
  editingId: number | null = null;
  editTitle = '';

  quadrants: { value: Task['quadrant']; label: string }[] = [
    { value: 'UI',   label: 'Urgent +\nImportant' },
    { value: 'UNI',  label: 'Urgent +\nNot imp.' },
    { value: 'NUI',  label: 'Not urgent +\nImp.' },
    { value: 'NUNI', label: 'Not urgent +\nNot imp.' }
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: t => this.tasks = t,
      error: () => this.error = 'Failed to load tasks.'
    });
  }

  onAddTask(): void {
    if (!this.newTitle.trim()) return;
    this.taskService.createTask({ title: this.newTitle.trim(), quadrant: this.newQuadrant, is_done: false }).subscribe({
      next: t => { this.tasks.push(t); this.newTitle = ''; },
      error: () => this.error = 'Failed to create task.'
    });
  }

  onToggleDone(task: Task): void {
    if (!task.id) return;
    this.taskService.patchTask(task.id, { is_done: !task.is_done }).subscribe({
      next: updated => {
        const i = this.tasks.findIndex(t => t.id === task.id);
        if (i !== -1) this.tasks[i] = updated;
      },
      error: () => this.error = 'Failed to update task.'
    });
  }

  onDelete(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.tasks = this.tasks.filter(t => t.id !== id),
      error: () => this.error = 'Failed to delete task.'
    });
  }

  startEdit(task: Task): void {
    this.editingId = task.id!;
    this.editTitle = task.title;
  }

  saveEdit(task: Task): void {
    if (!task.id || !this.editTitle.trim()) return;
    this.taskService.patchTask(task.id, { title: this.editTitle.trim() }).subscribe({
      next: updated => {
        const i = this.tasks.findIndex(t => t.id === task.id);
        if (i !== -1) this.tasks[i] = updated;
        this.editingId = null;
      },
      error: () => this.error = 'Failed to update task.'
    });
  }

  cancelEdit(): void { this.editingId = null; }

  quadrantClass(q: string): string {
    const map: Record<string, string> = { UI: 'tag-ui', UNI: 'tag-uni', NUI: 'tag-nui', NUNI: 'tag-nuni' };
    return map[q] || '';
  }

  dotClass(q: string): string {
    const map: Record<string, string> = { UI: 'dot-ui', UNI: 'dot-uni', NUI: 'dot-nui', NUNI: 'dot-nuni' };
    return map[q] || '';
  }
}
