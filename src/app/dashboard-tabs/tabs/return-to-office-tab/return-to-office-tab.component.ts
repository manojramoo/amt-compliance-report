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

  protected isSubmitting = false;
  protected submitSuccess = false;
  protected submitError: string | null = null;

  protected readonly content: TabContent = {
    title: 'Return to Office Overview',
    description: 'Fidelity Return to office',
    metrics: [
    ],
    insights: [
    ],
    actions: [
      
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
    this.httpClient.post('http://localhost:8080/formsubmit', payload).subscribe({
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
