import { Component, input, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IItem, IMovieList } from '../../models/IMovies';
import { IconComponent } from '../icon/icon.component';
import { ModalComponent } from '../modal/modal.component';
import { ListsService } from '../../../core/services/lists.service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-card-movie-list',
  standalone: true,
  imports: [IconComponent, ModalComponent, NgClass],
  templateUrl: './card-movie-list.component.html',
  styleUrl: './card-movie-list.component.scss',
  host: {
    '(click)': 'navigateTo()'
  }
})
export class CardMovieListComponent {

  public item = input<IMovieList>();
  public edit = input<boolean>(false);
  public listID = input<string>('');
  public ranked = input<boolean>(false);
  public order = input<number>(0);

  protected showDeleteModal = signal(false);

  private router = inject(Router);
  private listsService = inject(ListsService);

  navigateTo(): void {
    if (!this.edit()) {
      this.router.navigate(['/movie', this.item()!.id]);
    }
  }

  deleteItem(): void {
    if (this.item()) {
      this.listsService.removeItemFromListById(this.listID(), this.item()!.itemId).subscribe({
        next: () => {
          this.showDeleteModal.set(false);
        },
        error: (error) => {
          console.error('Erro ao excluir item:', error);
        }
      });
    }
  }

}
