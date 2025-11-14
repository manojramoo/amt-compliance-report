import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Subject, catchError, of, switchMap, takeUntil, timer } from 'rxjs';

interface OfficePresenceRecord {
  name: string;
  corpId: string;
  location: string;
}

@Component({
  selector: 'app-office-presence-data-tab',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './office-presence-data-tab.component.html',
  styleUrl: './office-presence-data-tab.component.css'
})
export class OfficePresenceDataTabComponent implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly destroy$ = new Subject<void>();
  protected readonly refreshIntervalMs = 30000;

  protected readonly presenceData = signal<OfficePresenceRecord[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    timer(0, this.refreshIntervalMs)
      .pipe(
        switchMap(() => {
          this.loading.set(true);
          return this.http
            .get<OfficePresenceRecord[]>('http://localhost:8080/presencedata')
            .pipe(
              catchError(() => {
                this.error.set(
                  'Unable to load office presence data. Please try again later.'
                );
                return of<OfficePresenceRecord[] | null>(null);
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data) {
          this.presenceData.set(data);
          this.error.set(null);
        }

        this.loading.set(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected trackByCorpId(_: number, record: OfficePresenceRecord): string {
    return record.corpId;
  }
}
