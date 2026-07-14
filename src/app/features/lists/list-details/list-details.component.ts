import { Component, inject, signal } from '@angular/core';
import { ListsService } from '../../../core/services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IList } from '../../../shared/models/ILists';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CardMovieListComponent } from '../../../shared/components/card-movie-list/card-movie-list.component';

@Component({
  selector: 'app-list-details',
  standalone: true,
  imports: [IconComponent, CardMovieListComponent],
  templateUrl: './list-details.component.html',
  styleUrl: './list-details.component.scss'
})
export class ListDetailsComponent {

  private listsService = inject(ListsService);
  private activatedRoute = inject(ActivatedRoute);


  protected list = signal<IList | null>(null);
  public editMode = signal<boolean>(false);

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


}
