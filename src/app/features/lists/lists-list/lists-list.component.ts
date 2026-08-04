import { Component, inject, signal } from '@angular/core';
import { ListsService } from '../../../core/services/lists.service';
import { IItemList, IList } from '../../../shared/models/ILists';
import { CardListComponent } from '../../../shared/components/card-list/card-list.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-lists-list',
  standalone: true,
  imports: [CardListComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './lists-list.component.html',
  styleUrl: './lists-list.component.scss'
})
export class ListsListComponent {

  private listsService = inject(ListsService);

  // protected lists = signal<IList[] | null>(null);
  protected lists = toSignal(this.listsService.getUserLists(), { initialValue: [] });
  protected modalNovaLista = signal<boolean>(false);

  protected formList!: FormGroup;
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {

    // this.getLists();
    
    this.formList = this.formBuilder.group({
      title: [''],
      isPrivated: [false],
      items: [[]],
      icon: ['list'],
      isRanked: [false]
    });
  }

  // getLists(): void {
  //   this.listsService.getUserLists().subscribe({
  //     next: (lists) => {
  //       this.lists.set(lists);
  //       console.log('Listas do usuário:', lists);
  //     }
  //   });
  // }

  addNewList(): void {
    this.listsService.createList(this.formList.value).subscribe({
      next: (listId) => {
        console.log('Lista criada com sucesso. ID:', listId);
        this.formList.reset({ title: '', isPrivated: false, items: [], icon: 'list' });
        this.modalNovaLista.set(false);
      },
      error: (error) => {
        console.error('Erro ao criar a lista:', error);
      }
    });
  }

}
