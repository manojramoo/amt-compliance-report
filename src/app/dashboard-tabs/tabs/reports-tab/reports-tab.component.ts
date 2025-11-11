import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TimeSheetDefaulterTabComponent } from '../time-sheet-defaulter-tab/time-sheet-defaulter-tab.component';

type ReportTabIdentifier = 'time-sheet-defaulter';

@Component({
  selector: 'app-reports-tab',
  standalone: true,
  imports: [CommonModule, TimeSheetDefaulterTabComponent],
  templateUrl: './reports-tab.component.html',
  styleUrl: './reports-tab.component.css'
})
export class ReportsTabComponent {
  protected readonly reportTabs: { id: ReportTabIdentifier; label: string }[] = [
    { id: 'time-sheet-defaulter', label: 'Time Sheet Defaulter' }
  ];

  protected readonly activeReportTab = signal<ReportTabIdentifier>(this.reportTabs[0].id);

  protected setActiveReportTab(tabId: ReportTabIdentifier): void {
    this.activeReportTab.set(tabId);
  }

  protected trackReportTabsById(
    _: number,
    tab: { id: ReportTabIdentifier }
  ): ReportTabIdentifier {
    return tab.id;
  }
}
