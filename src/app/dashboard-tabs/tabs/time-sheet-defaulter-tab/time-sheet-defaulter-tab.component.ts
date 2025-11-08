import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabContentViewComponent } from '../../components/tab-content-view/tab-content-view.component';
import { TabContent } from '../../models/tab-content.model';

@Component({
  selector: 'app-time-sheet-defaulter-tab',
  standalone: true,
  imports: [CommonModule, TabContentViewComponent],
  templateUrl: './time-sheet-defaulter-tab.component.html'
})
export class TimeSheetDefaulterTabComponent {
  protected readonly content: TabContent = {
    title: 'Time Sheet Compliance',
    description: 'Identify outstanding submissions and help teams close the compliance gap.',
    metrics: [
      { label: 'Submission Rate', value: '88%', change: '+6% week-over-week', positive: true },
      { label: 'Overdue Entries', value: '31 employees', change: '-11 vs. last cycle', positive: true },
      { label: 'Auto-Lock Risk', value: '5 projects', change: 'Locking in 48 hours', positive: false }
    ],
    insights: [
      {
        title: 'Defaulter Breakdown',
        points: [
          'Professional services team accounts for 45% of pending submissions.',
          'Contract staff have a 2-day delay on average compared to full-time employees.'
        ]
      },
      {
        title: 'Remediation Plan',
        points: [
          'Automated nudges triggered hourly until completion.',
          'Enable manager override to extend deadline for critical engagements.'
        ]
      }
    ],
    actions: [
      'Send summary report to project owners with highlighted blockers.',
      'Host 15-minute refresher on mobile time entry workflow.',
      'Escalate chronic non-compliance cases to finance for follow-up.'
    ]
  };
}
