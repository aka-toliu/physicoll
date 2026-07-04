import { Component, inject, signal } from '@angular/core';
import { ListsService } from '../../../core/services/lists.service';
import { IItemList, IList } from '../../../shared/models/ILists';
import { CardListComponent } from '../../../shared/components/card-list/card-list.component';

@Component({
  selector: 'app-lists-list',
  standalone: true,
  imports: [CardListComponent],
  templateUrl: './lists-list.component.html',
  styleUrl: './lists-list.component.scss'
})
export class ListsListComponent {

  private listsService = inject(ListsService);

  protected lists = signal<IList[] | null>(null);

  ngOnInit(): void {
    this.listsService.getUserLists().subscribe({
      next: (lists) => {
        this.lists.set(lists);
        console.log('Listas do usuário:', lists);
      }
    });
  }

}
