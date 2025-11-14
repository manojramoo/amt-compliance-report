import { createFeature, createReducer, on } from '@ngrx/store';

import {
  loadOfficePresenceData,
  loadOfficePresenceDataFailure,
  loadOfficePresenceDataSuccess,
  stopOfficePresencePolling
} from './office-presence.actions';
import { OfficePresenceState } from './office-presence.models';

export const OFFICE_PRESENCE_FEATURE_KEY = 'officePresence';

const initialState: OfficePresenceState = {
  records: [],
  loading: false,
  error: null
};

export const officePresenceFeature = createFeature({
  name: OFFICE_PRESENCE_FEATURE_KEY,
  reducer: createReducer(
    initialState,
    on(loadOfficePresenceData, (state: OfficePresenceState): OfficePresenceState => ({
      ...state,
      loading: true,
      error: null
    })),
    on(
      loadOfficePresenceDataSuccess,
      (state: OfficePresenceState, { records }): OfficePresenceState => ({
        ...state,
        records,
        loading: false,
        error: null
      })
    ),
    on(
      loadOfficePresenceDataFailure,
      (state: OfficePresenceState, { error }): OfficePresenceState => ({
        ...state,
        loading: false,
        error
      })
    ),
    on(stopOfficePresencePolling, (state: OfficePresenceState): OfficePresenceState => ({
      ...state,
      loading: false
    }))
  )
});

export const {
  name: officePresenceFeatureKey,
  reducer: officePresenceReducer,
  selectOfficePresenceState,
  selectRecords: selectOfficePresenceRecords,
  selectLoading: selectOfficePresenceLoading,
  selectError: selectOfficePresenceError
} = officePresenceFeature;
