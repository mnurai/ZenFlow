import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./components/tasks/tasks.component').then(m => m.TasksComponent)
      },
      {
        path: 'checkin',
        loadComponent: () =>
          import('./components/checkin/checkin.component').then(m => m.CheckinComponent)
      },
      {
        path: 'recommendation',
        loadComponent: () =>
          import('./components/recommendation/recommendation.component').then(m => m.RecommendationComponent)
      },
      {
        path: 'watchlist',
        loadComponent: () =>
          import('./components/watchlist/watchlist.component').then(m => m.WatchlistComponent)
      },
      {
        path: 'booklist',
        loadComponent: () =>
          import('./components/booklist/booklist.component').then(m => m.BooklistComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
