import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabContentViewComponent } from '../../components/tab-content-view/tab-content-view.component';
import { TabContent } from '../../models/tab-content.model';

@Component({
  selector: 'app-leave-plans-tab',
  standalone: true,
  imports: [CommonModule, TabContentViewComponent],
  templateUrl: './leave-plans-tab.component.html'
})
export class LeavePlansTabComponent {
  protected readonly content: TabContent = {
    title: 'Leave Plan Tracker',
    description: 'Stay ahead of staffing gaps by understanding upcoming PTO and absences.',
    metrics: [
      { label: 'Upcoming PTO', value: '214 days', change: '+18 days scheduled', positive: false },
      { label: 'Critical Coverage', value: '92%', change: '+4% with back-up assignments', positive: true },
      { label: 'Overlap Risk', value: '7 teams', change: '2 new overlaps flagged', positive: false }
    ],
    insights: [
      {
        title: 'Hot Spots',
        points: [
          'QA release cycle aligns with high PTO in September; secure contract testers.',
          'Finance approvals pending for 6 extended sabbatical requests.'
        ]
      },
      {
        title: 'Team Readiness',
        points: [
          'Coverage plans in design org are fully documented for Q3.',
          'Managers completed 96% of hand-off checklists on time.'
        ]
      }
    ],
    actions: [
      'Publish PTO calendar reminder and encourage updates before month-end.',
      'Coordinate cross-training sessions for payroll and compliance analysts.',
      'Review leave carry-over balances with HR policy team.'
    ]
  };
}
