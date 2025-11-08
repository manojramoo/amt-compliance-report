export type TabIdentifier = 'return-to-office' | 'leave-plans' | 'time-sheet-defaulter';

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
