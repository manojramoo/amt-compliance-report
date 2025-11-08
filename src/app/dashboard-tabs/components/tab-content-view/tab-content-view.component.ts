import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Metric, TabContent } from '../../models/tab-content.model';

@Component({
  selector: 'app-tab-content-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-content-view.component.html'
})
export class TabContentViewComponent {
  @Input({ required: true }) content!: TabContent;

  protected trackMetricsByLabel(_: number, metric: Metric): string {
    return metric.label;
  }

  protected trackInsightsByTitle(_: number, insight: { title: string }): string {
    return insight.title;
  }

  protected trackPointsByIndex(index: number): number {
    return index;
  }
}
