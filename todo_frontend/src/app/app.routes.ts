import { Routes } from '@angular/router';
import { canActivateAuth } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'auth', loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'todo', canActivate: [canActivateAuth], loadComponent: () => import('./features/todo/todo.component').then(m => m.TodoComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' }
];
