import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard-tabs/dashboard-tabs.component').then(
        (c) => c.DashboardTabsComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((c) => c.LoginComponent)
  },
  {
    path: 'report',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./report/report.component').then((c) => c.ReportComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
