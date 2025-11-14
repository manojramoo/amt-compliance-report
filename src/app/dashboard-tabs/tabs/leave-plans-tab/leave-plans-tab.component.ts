import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabContentViewComponent } from '../../components/tab-content-view/tab-content-view.component';
import { TabContent } from '../../models/tab-content.model';

@Component({
  selector: 'app-leave-plans-tab',
  standalone: true,
  imports: [CommonModule, TabContentViewComponent],
  templateUrl: './leave-plans-tab.component.html'
})
export class LeavePlansTabComponent {
  protected readonly content: TabContent = {
    title: 'Leave Plan Tracker',
    description: 'Leave Plan',
    metrics: [],
    insights: [],
    actions: [
    ]
  };
}
