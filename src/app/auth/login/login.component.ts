import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly authenticationError = signal<string | null>(null);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor() {
    if (this.authService.isAuthenticated()) {
      void this.navigateToDestination();
    }
  }

  protected clearAuthenticationError(): void {
    if (this.authenticationError() !== null) {
      this.authenticationError.set(null);
    }
  }

  protected submitCredentials(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    const isAuthenticated = this.authService.login(username, password);

    if (!isAuthenticated) {
      this.authenticationError.set('Invalid username or password.');
      this.loginForm.patchValue({ password: '' });
      return;
    }

    this.authenticationError.set(null);
    void this.navigateToDestination();
  }

  private async navigateToDestination(): Promise<void> {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    await this.router.navigateByUrl(returnUrl || '/report');
  }
}
