import { Component, inject, signal, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListsService } from '../../../core/services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IList } from '../../../shared/models/ILists';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CardMovieListComponent } from '../../../shared/components/card-movie-list/card-movie-list.component';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-details',
  standalone: true,
  imports: [IconComponent, CardMovieListComponent, DragDropModule, NgClass, ReactiveFormsModule],
  templateUrl: './list-details.component.html',
  styleUrl: './list-details.component.scss'
})
export class ListDetailsComponent {

  private listsService = inject(ListsService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  protected formItem: FormGroup = this.formBuilder.group({
    title: [''],
    isPrivated: [false],
    icon: ['list']
  });

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

          this.formItem.patchValue({
            title: list.title || '',
            isPrivated: list.isPrivated || false,
            icon: list.icon || 'list'
          });
        }
      },
      error: (error) => {
        console.error('Erro ao obter detalhes da lista:', error);
      }
    });
  }

  drop(event: CdkDragDrop<IList['items']>): void {
    const currentList = this.list();
    if (!currentList || !currentList.items) return;

    const updatedItems = [...currentList.items];

    moveItemInArray(updatedItems, event.previousIndex, event.currentIndex);

    this.list.set({
      ...currentList,
      items: updatedItems
    });
  }

  saveNewOrder(): void {
    const currentList = this.list();
    if (currentList?.id) {

      const dadosAtualizados: Partial<IList> = {
        title: this.formItem.get('title')?.value || currentList.title,
        items: currentList.items,
        isPrivated: this.formItem.get('isPrivated')?.value ?? currentList.isPrivated,
        icon: currentList.icon
      };

      this.listsService.updateList(currentList.id, dadosAtualizados).subscribe({
        next: () => {
          console.log('Lista e itens atualizados com sucesso no Firestore!');
          this.editMode.set(false);
        },
        error: (err) => {
          console.error('Erro ao salvar as alterações da lista:', err);
        }
      });
    }
  }

cancelEdit(): void {
    this.editMode.set(false);
    if (this.list()) {
      this.formItem.patchValue({
        title: this.list()?.title,
        isPrivated: this.list()?.isPrivated,
        icon: this.list()?.icon
      });
    }
  }


}
