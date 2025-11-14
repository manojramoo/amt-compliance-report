import { CommonModule } from '@angular/common';
import {
  Component,
  ViewEncapsulation,
  effect,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ReportTabIdentifier } from '../dashboard-tabs/models/tab-content.model';
import { LeaveComplianceReportTabComponent } from '../dashboard-tabs/tabs/leave-compliance-report-tab/leave-compliance-report-tab.component';
import { OfficePresenceDataTabComponent } from '../dashboard-tabs/tabs/office-presence-data-tab/office-presence-data-tab.component';
import { TimeSheetDefaulterTabComponent } from '../dashboard-tabs/tabs/time-sheet-defaulter-tab/time-sheet-defaulter-tab.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    TimeSheetDefaulterTabComponent,
    OfficePresenceDataTabComponent,
    LeaveComplianceReportTabComponent
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly reportTabs: { id: ReportTabIdentifier; label: string }[] = [
    { id: 'time-sheet-defaulter', label: 'Time Sheet Defaulter' },
    { id: 'office-presence-data', label: 'Office Presence Data' },
    { id: 'leave-compliance-report', label: 'Leave Compliance' }
  ];

  protected readonly activeReportTab = signal<ReportTabIdentifier>(
    this.reportTabs[0].id
  );

  constructor() {
    effect(() => {
      if (!this.authService.authStatus()) {
        void this.router.navigate(['/login'], {
          queryParams: { returnUrl: '/report' }
        });
      }
    });
  }

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
