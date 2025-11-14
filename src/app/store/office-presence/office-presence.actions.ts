import { createAction, props } from '@ngrx/store';

import { OfficePresenceRecord } from './office-presence.models';

export const startOfficePresencePolling = createAction(
  '[Office Presence] Start Polling'
);

export const stopOfficePresencePolling = createAction(
  '[Office Presence] Stop Polling'
);

export const loadOfficePresenceData = createAction(
  '[Office Presence] Load Data'
);

export const loadOfficePresenceDataSuccess = createAction(
  '[Office Presence] Load Data Success',
  props<{ records: OfficePresenceRecord[] }>()
);

export const loadOfficePresenceDataFailure = createAction(
  '[Office Presence] Load Data Failure',
  props<{ error: string }>()
);
