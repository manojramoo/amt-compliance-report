import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, signal } from '@angular/core';
import { FormTabIdentifier } from './models/tab-content.model';
import { LeavePlansTabComponent } from './tabs/leave-plans-tab/leave-plans-tab.component';
import { ReturnToOfficeTabComponent } from './tabs/return-to-office-tab/return-to-office-tab.component';

@Component({
  selector: 'app-dashboard-tabs',
  standalone: true,
  imports: [
    CommonModule,
    ReturnToOfficeTabComponent,
    LeavePlansTabComponent
  ],
  templateUrl: './dashboard-tabs.component.html',
  styleUrl: './dashboard-tabs.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardTabsComponent {
  readonly formTabs: { id: FormTabIdentifier; label: string }[] = [
    { id: 'return-to-office', label: 'Return to Office' },
    { id: 'leave-plans', label: 'Leave Plans' }
  ];

  protected readonly activeFormTab = signal<FormTabIdentifier>(
    this.formTabs[0].id
  );

  protected setActiveFormTab(tabId: FormTabIdentifier): void {
    this.activeFormTab.set(tabId);
  }
  protected trackFormTabsById(
    _: number,
    tab: { id: FormTabIdentifier }
  ): FormTabIdentifier {
    return tab.id;
  }
}
