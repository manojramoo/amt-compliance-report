import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard-tabs/dashboard-tabs.component').then(
        (c) => c.DashboardTabsComponent
      )
  },
  {
    path: 'report',
    loadComponent: () =>
      import('./report/report.component').then((c) => c.ReportComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
