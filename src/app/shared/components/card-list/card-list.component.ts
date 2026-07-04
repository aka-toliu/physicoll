import { Component, computed, input } from '@angular/core';
import { IList } from '../../models/ILists';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent {

  public list = input<IList | null>(null);

  public recentItems = computed(() => {
    if (!this.list()) return [];
    return this.list()?.items.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).slice(0, 5);
  });


}
