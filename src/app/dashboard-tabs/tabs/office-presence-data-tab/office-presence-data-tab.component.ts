import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';


import {
  OfficePresenceRecord,
  OFFICE_PRESENCE_REFRESH_INTERVAL_MS,
  selectOfficePresenceError,
  selectOfficePresenceLoading,
  selectOfficePresenceRecords,
  startOfficePresencePolling,
  stopOfficePresencePolling
} from '../../../store/office-presence';

@Component({
  selector: 'app-office-presence-data-tab',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './office-presence-data-tab.component.html',
  styleUrl: './office-presence-data-tab.component.css'
})
export class OfficePresenceDataTabComponent implements OnInit, OnDestroy {
  private readonly store: Store = inject(Store);

  protected readonly refreshIntervalMs = OFFICE_PRESENCE_REFRESH_INTERVAL_MS;

  protected readonly presenceData = this.store.selectSignal(
    selectOfficePresenceRecords
  );
  protected readonly loading = this.store.selectSignal(
    selectOfficePresenceLoading
  );
  protected readonly error = this.store.selectSignal(selectOfficePresenceError);

  ngOnInit(): void {
    this.store.dispatch(startOfficePresencePolling());
  }

  ngOnDestroy(): void {
    this.store.dispatch(stopOfficePresencePolling());
  }

  protected trackByCorpId(_: number, record: OfficePresenceRecord): string {
    return record.corpID;
  }
}
