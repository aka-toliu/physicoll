import { Component, inject, signal } from '@angular/core';
import { ListsService } from '../../../core/services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IList } from '../../../shared/models/ILists';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-list-details',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './list-details.component.html',
  styleUrl: './list-details.component.scss'
})
export class ListDetailsComponent {

  private listsService = inject(ListsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  protected list = signal<IList | null>(null);

  ngOnInit(): void {
    this.getListDetails();
  }

  getListDetails(): void {

    const listId = this.activatedRoute.snapshot.paramMap.get('listID');

    this.listsService.getListById(listId!).subscribe({
      next: (list) => {
        if (list) {
          console.log('Detalhes da lista:', list);
          this.list.set(list);
        }
      }, 
      error: (error) => {
        console.error('Erro ao obter detalhes da lista:', error);
      }
    });
  }

  navigateTo(id: string, type: string): void {
    if (type === 'collection') {
      this.router.navigate(['/coll', id]);
    } else if (type === 'search') {
      this.router.navigate(['/movie', id]);
    }
  }
}
