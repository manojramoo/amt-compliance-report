import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabContentViewComponent } from '../../components/tab-content-view/tab-content-view.component';
import { TabContent } from '../../models/tab-content.model';

type OfficePresenceDayPayload = {
  date: string;
  present: boolean;
  location: string;
  reason: string;
};

type OfficePresencePayload = {
  month: string;
  days: OfficePresenceDayPayload[];
};

@Component({
  selector: 'app-return-to-office-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, TabContentViewComponent],
  templateUrl: './return-to-office-tab.component.html'
})
export class ReturnToOfficeTabComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly httpClient = inject(HttpClient);

  protected isSubmitting = false;
  protected submitSuccess = false;
  protected submitError: string | null = null;

  protected readonly content: TabContent = {
    title: 'Return to Office Overview',
    description: 'Monitor workplace attendance and the adoption of hybrid work policies across teams.',
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
  };

  protected readonly officePresenceForm = this.formBuilder.group({
    month: this.formBuilder.control(this.formatMonth(new Date()), {
      validators: Validators.required
    }),
    days: this.formBuilder.array([])
  });

  constructor() {
    const currentMonth = this.officePresenceForm.get('month')?.value;
    if (typeof currentMonth === 'string') {
      this.populateDaysForMonth(currentMonth);
    }
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

  protected onSubmit(): void {
    this.submitSuccess = false;
    this.submitError = null;

    this.officePresenceForm.markAllAsTouched();
    this.officePresenceForm.updateValueAndValidity({ emitEvent: false });

    if (this.officePresenceForm.invalid) {
      return;
    }

    const rawValue = this.officePresenceForm.getRawValue();
    const rawDays = (rawValue.days ?? []) as Array<{
      date: string;
      present: boolean;
      location?: string | null;
      reason?: string | null;
    }>;
    const payload: OfficePresencePayload = {
      month: rawValue.month ?? '',
      days: rawDays.map((day) => ({
        date: day.date,
        present: day.present,
        location: day.location ?? '',
        reason: day.reason ?? ''
      }))
    };

    this.isSubmitting = true;
    this.httpClient.post('/api/office-presence', payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
      },
      error: (error) => {
        console.error('Office presence submission failed', error);
        this.isSubmitting = false;
        this.submitError = 'We could not submit the office presence data. Please try again.';
      }
    });
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
