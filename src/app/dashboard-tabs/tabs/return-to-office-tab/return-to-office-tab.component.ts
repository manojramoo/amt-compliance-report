import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabContentViewComponent } from '../../components/tab-content-view/tab-content-view.component';
import { TabContent } from '../../models/tab-content.model';

type OfficePresencePayload = {
  name: string;
  corpId: string;
  workLocation: string;
  daysInOffice: number;
  reasonForNotComing?: string;
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

  private static readonly VALID_USERNAME = 'compliance-admin';
  private static readonly VALID_PASSWORD = 'Return2Office!';

  protected isAuthenticated = false;
  protected loginError: string | null = null;
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
    name: this.formBuilder.control('', { validators: Validators.required }),
    corpId: this.formBuilder.control('', { validators: Validators.required }),
    workLocation: this.formBuilder.control('', { validators: Validators.required }),
    daysInOffice: this.formBuilder.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)]
    }),
    reasonForNotComing: this.formBuilder.control('')
  });

  protected readonly loginForm = this.formBuilder.group({
    username: this.formBuilder.control('', { validators: Validators.required }),
    password: this.formBuilder.control('', { validators: Validators.required })
  });

  protected onLogin(): void {
    this.loginError = null;

    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity({ emitEvent: false });

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    if (
      username?.trim() === ReturnToOfficeTabComponent.VALID_USERNAME &&
      password === ReturnToOfficeTabComponent.VALID_PASSWORD
    ) {
      this.isAuthenticated = true;
      this.loginError = null;
      return;
    }

    this.loginError = 'Invalid username or password.';
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
    const reasonForNotComing = rawValue.reasonForNotComing?.trim() ?? '';
    const payload: OfficePresencePayload = {
      name: rawValue.name ?? '',
      corpId: rawValue.corpId ?? '',
      workLocation: rawValue.workLocation ?? '',
      daysInOffice: this.coerceDaysInOffice(rawValue.daysInOffice),
      ...(reasonForNotComing !== '' ? { reasonForNotComing } : {})
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

  private coerceDaysInOffice(value: number | string | null | undefined): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsedValue = Number(value);
      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }

    return 0;
  }
}
