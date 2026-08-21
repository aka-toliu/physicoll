import { Component, computed, inject, input } from '@angular/core';
import { IList } from '../../models/ILists';
import { IconComponent } from '../icon/icon.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
  host: {
    '(click)': 'navigateTo(list()?.id)'
  }
})
export class CardListComponent {

  public list = input<IList | null>(null);
  public username = input<string | null>(null);

  protected router = inject(Router);

  public recentItems = computed(() => {
    if (!this.list()) return [];
    return this.list()?.items.slice(0, 5);
  });

navigateTo(id?: string) {
    if (!id) return;

    const friend = this.username();

    if (friend) {
      console.log('/lists', friend, 'item', id);
      
      this.router.navigate(['/lists', friend, 'item', id]);

    } else {
      console.log('/lists', 'item', id);
      this.router.navigate(['/lists', 'item', id]);
    }
  }


}
