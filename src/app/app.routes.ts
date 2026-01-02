import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'contacts',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/contacts/contact-list.component').then(m => m.ContactListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/contacts/contact-form.component').then(m => m.ContactFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/contacts/contact-form.component').then(m => m.ContactFormComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/contacts/contact-form.component').then(m => m.ContactFormComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'contacts'
  }
];
