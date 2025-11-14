export interface OfficePresenceRecord {
  name: string;
  corpId: string;
  location: string;
}

export interface OfficePresenceState {
  records: OfficePresenceRecord[];
  loading: boolean;
  error: string | null;
}

export const OFFICE_PRESENCE_REFRESH_INTERVAL_MS = 30_000;
