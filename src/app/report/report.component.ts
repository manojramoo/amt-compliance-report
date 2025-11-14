import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, signal } from '@angular/core';
import { ReportTabIdentifier } from '../dashboard-tabs/models/tab-content.model';
import { LeaveComplianceReportTabComponent } from '../dashboard-tabs/tabs/leave-compliance-report-tab/leave-compliance-report-tab.component';
import { ResourceUtilizationReportTabComponent } from '../dashboard-tabs/tabs/resource-utilization-report-tab/resource-utilization-report-tab.component';
import { TimeSheetDefaulterTabComponent } from '../dashboard-tabs/tabs/time-sheet-defaulter-tab/time-sheet-defaulter-tab.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    TimeSheetDefaulterTabComponent,
    ResourceUtilizationReportTabComponent,
    LeaveComplianceReportTabComponent
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent {
  readonly reportTabs: { id: ReportTabIdentifier; label: string }[] = [
    { id: 'time-sheet-defaulter', label: 'Time Sheet Defaulter' },
    { id: 'resource-utilization-report', label: 'Resource Utilization' },
    { id: 'leave-compliance-report', label: 'Leave Compliance' }
  ];

  protected readonly activeReportTab = signal<ReportTabIdentifier>(
    this.reportTabs[0].id
  );

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
