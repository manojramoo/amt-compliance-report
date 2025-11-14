import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabContentViewComponent } from '../../components/tab-content-view/tab-content-view.component';
import { TabContent } from '../../models/tab-content.model';

@Component({
  selector: 'app-time-sheet-defaulter-tab',
  standalone: true,
  imports: [CommonModule, TabContentViewComponent],
  templateUrl: './time-sheet-defaulter-tab.component.html'
})
export class TimeSheetDefaulterTabComponent {
  protected readonly content: TabContent = {
    title: 'Time Sheet Compliance',
    description: 'Defaulters',
    metrics: [],
    insights: [],
    actions: []
  };
}
