import { Component } from '@angular/core';
import { DashboardTabsComponent } from './dashboard-tabs/dashboard-tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardTabsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
