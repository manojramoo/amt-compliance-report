import { Injectable, Signal, signal } from '@angular/core';

const AUTH_STORAGE_KEY = 'amt-report-authenticated';
const AUTH_USERNAME = 'amt-admin';
const AUTH_PASSWORD = 'Compliance123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticatedSignal = signal<boolean>(
    this.readInitialAuthState()
  );

  readonly authStatus: Signal<boolean> = this.authenticatedSignal.asReadonly();

  login(username: string, password: string): boolean {
    const isValidUser =
      username.trim() === AUTH_USERNAME && password === AUTH_PASSWORD;

    if (isValidUser) {
      this.setAuthenticatedState(true);
    }

    return isValidUser;
  }

  logout(): void {
    this.setAuthenticatedState(false);
  }

  isAuthenticated(): boolean {
    return this.authenticatedSignal();
  }

  private setAuthenticatedState(isAuthenticated: boolean): void {
    this.authenticatedSignal.set(isAuthenticated);

    if (typeof window === 'undefined') {
      return;
    }

    if (isAuthenticated) {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  private readInitialAuthState(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  }
}
