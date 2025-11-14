export type FormTabIdentifier = 'return-to-office' | 'leave-plans';
export type ReportTabIdentifier =
  | 'time-sheet-defaulter'
  | 'office-presence-data'
  | 'leave-compliance-report';

export type TabIdentifier = FormTabIdentifier | ReportTabIdentifier;

export interface Metric {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}

export interface InsightBlock {
  title: string;
  points: string[];
}

export interface TabContent {
  title: string;
  description: string;
  metrics: Metric[];
  insights: InsightBlock[];
  actions: string[];
}
