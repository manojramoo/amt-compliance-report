import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, signal } from '@angular/core';
import { TabIdentifier } from './models/tab-content.model';
import { LeavePlansTabComponent } from './tabs/leave-plans-tab/leave-plans-tab.component';
import { ReturnToOfficeTabComponent } from './tabs/return-to-office-tab/return-to-office-tab.component';
import { TimeSheetDefaulterTabComponent } from './tabs/time-sheet-defaulter-tab/time-sheet-defaulter-tab.component';

type FormTabIdentifier = Exclude<TabIdentifier, 'time-sheet-defaulter'>;
type ReportTabIdentifier = Extract<TabIdentifier, 'time-sheet-defaulter'>;

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
  readonly formTabs: { id: FormTabIdentifier; label: string }[] = [
    { id: 'return-to-office', label: 'Return to Office' },
    { id: 'leave-plans', label: 'Leave Plans' }
  ];

  readonly reportTabs: { id: ReportTabIdentifier; label: string }[] = [
    { id: 'time-sheet-defaulter', label: 'Time Sheet Defaulter' }
  ];

  protected readonly activeFormTab = signal<FormTabIdentifier>(
    this.formTabs[0].id
  );

  protected readonly activeReportTab = signal<ReportTabIdentifier>(
    this.reportTabs[0].id
  );

  protected setActiveFormTab(tabId: FormTabIdentifier): void {
    this.activeFormTab.set(tabId);
  }

  protected setActiveReportTab(tabId: ReportTabIdentifier): void {
    this.activeReportTab.set(tabId);
  }

  protected trackFormTabsById(
    _: number,
    tab: { id: FormTabIdentifier }
  ): FormTabIdentifier {
    return tab.id;
  }

  protected trackReportTabsById(
    _: number,
    tab: { id: ReportTabIdentifier }
  ): ReportTabIdentifier {
    return tab.id;
  }
}
