import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabContentViewComponent } from '../../components/tab-content-view/tab-content-view.component';
import { TabContent } from '../../models/tab-content.model';

@Component({
  selector: 'app-resource-utilization-report-tab',
  standalone: true,
  imports: [CommonModule, TabContentViewComponent],
  templateUrl: './resource-utilization-report-tab.component.html'
})
export class ResourceUtilizationReportTabComponent {
  protected readonly content: TabContent = {
    title: 'Resource Utilization Overview',
    description:
      'Evaluate staffing efficiency, billable ratios, and allocation balance to anticipate delivery risks.',
    metrics: [
      {
        label: 'Billable Utilization',
        value: '74%',
        change: '+5 pts vs. goal',
        positive: true
      },
      {
        label: 'Underallocated Staff',
        value: '18 employees',
        change: '+3 week-over-week',
        positive: false
      },
      {
        label: 'Overtime Exposure',
        value: '6 squads',
        change: 'Down 2 since last sprint',
        positive: true
      }
    ],
    insights: [
      {
        title: 'Staffing Highlights',
        points: [
          'Core platform teams are trending 12% above target capacity and require immediate backfill.',
          'Marketing analytics has 5 cross-trained analysts available for temporary assignment.'
        ]
      },
      {
        title: 'Delivery Risks',
        points: [
          'Two critical projects are forecast to exceed overtime thresholds within 10 days.',
          'Contract renewals lagging for Q4 resources—coordinate with procurement this week.'
        ]
      }
    ],
    actions: [
      'Rebalance 4 senior engineers from sustaining engineering to client onboarding workstreams.',
      'Publish utilization scorecard to department leads highlighting coverage gaps.',
      'Schedule staffing council review to approve surge staffing for strategic accounts.'
    ]
  };
}
