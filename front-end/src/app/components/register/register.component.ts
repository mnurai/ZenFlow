import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onRegister(): void {
    this.error = '';
    this.loading = true;
    this.auth.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => {
        localStorage.setItem('username', this.username);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = err.error?.username?.[0] || err.error?.email?.[0] || err.error?.password?.[0] || 'Registration failed.';
        this.error = msg;
        this.loading = false;
      }
    });
  }
}
