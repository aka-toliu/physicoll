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
    '(click)': 'navigateToListDetails(list()?.id)'
  }
})
export class CardListComponent {

  public list = input<IList | null>(null);

  protected router = inject(Router);

  public recentItems = computed(() => {
    if (!this.list()) return [];
    return this.list()?.items.slice(0, 5);
  });

  navigateToListDetails(listId: string | undefined): void {
    if (!listId) return;
    this.router.navigate(['/lists', listId]);
  }


}
