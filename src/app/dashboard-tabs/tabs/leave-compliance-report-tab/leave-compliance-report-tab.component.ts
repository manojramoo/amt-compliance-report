import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabContentViewComponent } from '../../components/tab-content-view/tab-content-view.component';
import { TabContent } from '../../models/tab-content.model';

@Component({
  selector: 'app-leave-compliance-report-tab',
  standalone: true,
  imports: [CommonModule, TabContentViewComponent],
  templateUrl: './leave-compliance-report-tab.component.html'
})
export class LeaveComplianceReportTabComponent {
  protected readonly content: TabContent = {
    title: 'Leave Compliance Summary',
    description:
      'Monitor upcoming time-off, policy adherence, and approvals to ensure adequate coverage.',
    metrics: [
      {
        label: 'Upcoming PTO',
        value: '312 days',
        change: '+9% vs. last quarter',
        positive: false
      },
      {
        label: 'Approval SLA',
        value: '94% on time',
        change: '+4 pts month-over-month',
        positive: true
      },
      {
        label: 'Policy Exceptions',
        value: '7 cases',
        change: 'Flat week-over-week',
        positive: false
      }
    ],
    insights: [
      {
        title: 'Coverage Watchlist',
        points: [
          'Customer success pod beta has 3 overlapping leaves in late August—initiate backfill plan.',
          'Critical SAP upgrade has zero leave blackouts requested; alert program managers.'
        ]
      },
      {
        title: 'Policy Signals',
        points: [
          'Spike in exceptions tied to new parental leave extension—update manager playbook.',
          'Two regions still missing digital signatures on updated leave policy acknowledgement.'
        ]
      }
    ],
    actions: [
      'Send proactive coverage checklist to managers with high PTO overlap.',
      'Launch microlearning on updated leave policy and escalation paths.',
      'Audit exception approvals older than 30 days for compliance gaps.'
    ]
  };
}
