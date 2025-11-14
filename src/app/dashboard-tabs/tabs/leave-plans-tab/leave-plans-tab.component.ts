import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TabContentViewComponent } from '../../components/tab-content-view/tab-content-view.component';
import { TabContent } from '../../models/tab-content.model';

@Component({
  selector: 'app-leave-plans-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TabContentViewComponent],
  templateUrl: './leave-plans-tab.component.html',
  styleUrls: ['./leave-plans-tab.component.scss']
})
export class LeavePlansTabComponent {
  protected readonly submissionMessage = signal('');

  protected readonly leavePlanForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    workingDays: ['']
  });

  protected readonly content: TabContent = {
    title: 'Leave Plan Tracker',
    description: 'Submit your annual leave plan and automatically calculate working days.',
    metrics: [],
    insights: [],
    actions: [
    ]
  };

  constructor(private readonly formBuilder: FormBuilder) {
    this.leavePlanForm.valueChanges.subscribe(() => {
      this.submissionMessage.set('');
      this.updateWorkingDays();
    });
  }

  protected onSubmit(): void {
    if (this.leavePlanForm.invalid) {
      this.leavePlanForm.markAllAsTouched();
      return;
    }

    const name = this.leavePlanForm.get('name')?.value ?? '';
    const startDate = this.leavePlanForm.get('startDate')?.value ?? '';
    const endDate = this.leavePlanForm.get('endDate')?.value ?? '';
    const workingDays = this.leavePlanForm.get('workingDays')?.value ?? '';

    this.submissionMessage.set(
      `Leave plan submitted for ${name} (${startDate} – ${endDate}) covering ${workingDays} working days.`
    );

    this.leavePlanForm.reset({ name: '', startDate: '', endDate: '', workingDays: '' }, { emitEvent: false });
  }

  private updateWorkingDays(): void {
    const startDateValue = this.leavePlanForm.get('startDate')?.value;
    const endDateValue = this.leavePlanForm.get('endDate')?.value;

    if (!startDateValue || !endDateValue) {
      this.leavePlanForm.get('workingDays')?.setValue('', { emitEvent: false });
      return;
    }

    const start = new Date(startDateValue);
    const end = new Date(endDateValue);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      this.leavePlanForm.get('workingDays')?.setValue('', { emitEvent: false });
      return;
    }

    let workingDays = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        workingDays += 1;
      }

      current.setDate(current.getDate() + 1);
    }

    this.leavePlanForm.get('workingDays')?.setValue(String(workingDays), { emitEvent: false });
  }
}
