import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, takeUntil, timer } from 'rxjs';

import {
  loadOfficePresenceData,
  loadOfficePresenceDataFailure,
  loadOfficePresenceDataSuccess,
  startOfficePresencePolling,
  stopOfficePresencePolling
} from './office-presence.actions';
import {
  OFFICE_PRESENCE_REFRESH_INTERVAL_MS,
  OfficePresenceRecord
} from './office-presence.models';

@Injectable()
export class OfficePresenceEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly httpClient: HttpClient = inject(HttpClient);

  readonly startPolling$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startOfficePresencePolling),
      switchMap(() =>
        timer(0, OFFICE_PRESENCE_REFRESH_INTERVAL_MS).pipe(
          map(() => loadOfficePresenceData()),
          takeUntil(this.actions$.pipe(ofType(stopOfficePresencePolling)))
        )
      )
    )
  );

  readonly loadPresenceData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOfficePresenceData),
      exhaustMap(() =>
        this.httpClient
          .get<OfficePresenceRecord[]>(
            'http://localhost:8080/presencedata'
          )
          .pipe(
            map((records) => loadOfficePresenceDataSuccess({ records })),
            catchError(() =>
              of(
                loadOfficePresenceDataFailure({
                  error:
                    'Unable to load office presence data. Please try again later.'
                })
              )
            )
          )
      )
    )
  );
}
