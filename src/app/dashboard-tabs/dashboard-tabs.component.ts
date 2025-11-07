import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type TabIdentifier = 'return-to-office' | 'leave-plans' | 'time-sheet-defaulter';

interface Metric {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}

interface InsightBlock {
  title: string;
  points: string[];
}

interface TabContent {
  title: string;
  description: string;
  metrics: Metric[];
  insights: InsightBlock[];
  actions: string[];
}

@Component({
  selector: 'app-dashboard-tabs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-tabs.component.html',
  styleUrl: './dashboard-tabs.component.css'
})
export class DashboardTabsComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly tabs: { id: TabIdentifier; label: string }[] = [
    { id: 'return-to-office', label: 'Return to Office' },
    { id: 'leave-plans', label: 'Leave Plans' },
    { id: 'time-sheet-defaulter', label: 'Time Sheet Defaulter' }
  ];

  readonly officePresenceForm = this.formBuilder.group({
    month: this.formBuilder.control(this.formatMonth(new Date()), {
      validators: Validators.required
    }),
    days: this.formBuilder.array([])
  });

  readonly tabContent: Record<TabIdentifier, TabContent> = {
    'return-to-office': {
      title: 'Return to Office Overview',
      description:
        'Monitor workplace attendance and the adoption of hybrid work policies across teams.',
      metrics: [
        { label: 'Hybrid Attendance', value: '68%', change: '+3% vs. last month', positive: true },
        { label: 'On-site Coverage', value: '4.5 days', change: '+0.5 day goal gap', positive: false },
        { label: 'Desk Utilization', value: '72%', change: '+8% compared to Q1', positive: true }
      ],
      insights: [
        {
          title: 'Key Insights',
          points: [
            'Teams in the product group continue to exceed attendance targets by 12%.',
            'Customer support has the lowest presence; monitor week 32 for improvement.',
            'Consider increasing shuttle frequency on high-demand days (Tue/Wed).'
          ]
        },
        {
          title: 'Engagement Pulse',
          points: [
            '82% of employees report satisfaction with the current hybrid schedule.',
            'Facilities requests dropped by 15% after flexible seating rollout.'
          ]
        }
      ],
      actions: [
        'Share weekly occupancy snapshot with department heads.',
        'Confirm conference room sensor calibration before leadership summit.',
        'Pilot optional Friday remote day for engineering squads.'
      ]
    },
    'leave-plans': {
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
    },
    'time-sheet-defaulter': {
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
    }
  };

  protected readonly activeTab = signal<TabIdentifier>(this.tabs[0].id);

  constructor() {
    const currentMonth = this.officePresenceForm.get('month')?.value;
    if (typeof currentMonth === 'string') {
      this.populateDaysForMonth(currentMonth);
    }
  }

  protected setActiveTab(tabId: TabIdentifier): void {
    this.activeTab.set(tabId);
  }

  protected trackTabsById(_: number, tab: { id: TabIdentifier }): TabIdentifier {
    return tab.id;
  }

  protected get officePresenceDays(): FormArray<FormGroup> {
    return this.officePresenceForm.get('days') as FormArray<FormGroup>;
  }

  protected onMonthChange(): void {
    const monthValue = this.officePresenceForm.get('month')?.value;
    if (typeof monthValue === 'string') {
      this.populateDaysForMonth(monthValue);
    } else {
      this.clearOfficePresenceDays();
    }
  }

  protected onPresenceToggle(dayIndex: number): void {
    const dayGroup = this.officePresenceDays.at(dayIndex) as FormGroup | null;
    if (dayGroup) {
      this.updateDayValidators(dayGroup);
    }
  }

  protected trackPresenceByDate(_: number, control: FormGroup): string {
    const dateValue = control.get('date')?.value;
    if (dateValue instanceof Date) {
      return dateValue.toISOString();
    }
    if (typeof dateValue === 'string') {
      return dateValue;
    }
    return `${_}`;
  }

  private populateDaysForMonth(monthValue: string): void {
    this.clearOfficePresenceDays();
    const [yearString, monthString] = monthValue.split('-');
    const year = Number(yearString);
    const month = Number(monthString);

    if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
      return;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month - 1, day);

      if (this.isWeekend(date)) {
        continue;
      }

      const dayGroup = this.createDayGroup(date);
      this.officePresenceDays.push(dayGroup);
      this.updateDayValidators(dayGroup);
    }
  }

  private createDayGroup(date: Date): FormGroup {
    return this.formBuilder.group({
      date: this.formBuilder.control(date.toISOString()),
      present: this.formBuilder.control(false),
      location: this.formBuilder.control({ value: '', disabled: true }),
      reason: this.formBuilder.control('', { validators: Validators.required })
    });
  }

  private updateDayValidators(dayGroup: FormGroup): void {
    const presentControl = dayGroup.get('present');
    const locationControl = dayGroup.get('location');
    const reasonControl = dayGroup.get('reason');
    const isPresent = presentControl?.value === true;

    if (isPresent) {
      locationControl?.enable({ emitEvent: false });
      locationControl?.setValidators(Validators.required);
      locationControl?.updateValueAndValidity({ emitEvent: false });

      reasonControl?.setValue('', { emitEvent: false });
      reasonControl?.clearValidators();
      reasonControl?.disable({ emitEvent: false });
      reasonControl?.updateValueAndValidity({ emitEvent: false });
    } else {
      reasonControl?.enable({ emitEvent: false });
      reasonControl?.setValidators(Validators.required);
      reasonControl?.updateValueAndValidity({ emitEvent: false });

      locationControl?.setValue('', { emitEvent: false });
      locationControl?.clearValidators();
      locationControl?.disable({ emitEvent: false });
      locationControl?.updateValueAndValidity({ emitEvent: false });
    }
  }

  private isWeekend(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  private clearOfficePresenceDays(): void {
    const daysArray = this.officePresenceDays;
    while (daysArray.length > 0) {
      daysArray.removeAt(daysArray.length - 1);
    }
  }

  private formatMonth(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${date.getFullYear()}-${month}`;
  }
}
