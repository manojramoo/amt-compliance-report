import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, signal } from '@angular/core';
import { TabIdentifier } from './models/tab-content.model';
import { LeavePlansTabComponent } from './tabs/leave-plans-tab/leave-plans-tab.component';
import { ReturnToOfficeTabComponent } from './tabs/return-to-office-tab/return-to-office-tab.component';
import { TimeSheetDefaulterTabComponent } from './tabs/time-sheet-defaulter-tab/time-sheet-defaulter-tab.component';

@Component({
  selector: 'app-dashboard-tabs',
  standalone: true,
  imports: [
    CommonModule,
    ReturnToOfficeTabComponent,
    LeavePlansTabComponent,
    TimeSheetDefaulterTabComponent
  ],
  templateUrl: './dashboard-tabs.component.html',
  styleUrl: './dashboard-tabs.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardTabsComponent {
  readonly tabs: { id: TabIdentifier; label: string }[] = [
    { id: 'return-to-office', label: 'Return to Office' },
    { id: 'leave-plans', label: 'Leave Plans' },
    { id: 'time-sheet-defaulter', label: 'Time Sheet Defaulter' }
  ];

  protected readonly activeTab = signal<TabIdentifier>(this.tabs[0].id);

  protected setActiveTab(tabId: TabIdentifier): void {
    this.activeTab.set(tabId);
  }

  protected trackTabsById(_: number, tab: { id: TabIdentifier }): TabIdentifier {
    return tab.id;
  }
}
