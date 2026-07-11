import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass, NgStyle } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CollectionService } from '../../../core/services/collection.service';
import { ICollectionItem } from '../../../shared/models/ICollection';
import { EFormat, ECaseState, EDiscState, ETapeState, EVHSCase, EBluRayCase, EDVDCase } from '../../../shared/models/EItem';
import { ELanguages } from '../../../shared/models/ELanguages';
import { CollFormComponent } from '../../../shared/components/coll-form/coll-form.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ProfileService } from '../../../core/services/profile.service';
import { ListsService } from '../../../core/services/lists.service';
import { IList } from '../../../shared/models/ILists';



@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [NgClass, IconComponent, DatePipe, CurrencyPipe, NgStyle, CollFormComponent, ModalComponent],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss',

})
export class ItemDetailsComponent {

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private collectionService = inject(CollectionService);
  private listsService = inject(ListsService);
  private profileService = inject(ProfileService);
  private uid = signal(localStorage.getItem('UID'));

  public languageOptions = Object.keys(ELanguages) as Array<keyof typeof ELanguages>;
  public ELanguages = ELanguages;
  public ECaseState = ECaseState;
  public EFormat = EFormat;
  public EDiscState = EDiscState;
  public ETapeState = ETapeState;
  public EDVDCase = EDVDCase;
  public EBluRayCase = EBluRayCase;
  public EVHSCase = EVHSCase;

  protected item = signal<ICollectionItem | null>(null);
  protected stars!: number[];
  protected showOptions = signal(false);
  protected lists = signal<IList[]>([]);
  protected listSelected = signal<string | null>(null);
  
  protected showDeleteModal = signal(false);
  protected modalEditCollection = signal(false);
  protected showModalAddToList = signal(false);

  

  ngOnInit(): void {
    this.getItem();
  }

  getItem() {
    const uid = localStorage.getItem('UID');
    const itemId = this.activatedRoute.snapshot.params['itemID'];

    this.collectionService.getCollectionItem(uid, itemId).subscribe({
      next: (item) => {
        this.stars = Array(item?.personalRating || 0).fill(1).concat(Array(5 - (item?.personalRating || 0)).fill(0));
        this.item.set(item);
        console.log(item);

      },
      error: (err) => {
        console.error('Error ao buscar detalhes do item:', err);
      }
    })

  }

  deleteItem(){
    const uid = localStorage.getItem('UID');
    const itemId = this.item()?.id;
    this.collectionService.deleteCollectionItem(uid, itemId!).subscribe({
      next: () => {
        console.log('Item deletado com sucesso');
        this.router.navigate(['/coll']);
      },
      error: (err) => {
        console.error('Error ao deletar item:', err);
      }
    });
  }

  getLabel(value: any, enumObj: any): string {
    return enumObj[value] || value;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  toggleOptions(event: Event) {
    event.stopPropagation();
    this.showOptions.set(!this.showOptions());
  }

  getLists(): void{
    this.listsService.getUserLists().subscribe({
      next: (lists) => {
        console.log('Listas do usuário:', lists);
        this.lists.set(lists);
      },
      error: (err) => {
        console.error('Erro ao buscar listas do usuário:', err);
      }
    });
  }


  addToList(): void {
    const movieToAdd = {
      id: this.item()?.imdbID!,
      title: this.item()?.title!,
      poster: this.item()?.poster!,
      order: computed(() => this.lists().find(list => list.id === this.listSelected())?.items.length || 0)(),
      type: 'collection' as const
    }

    this.listsService.addItemToList(this.listSelected()!, movieToAdd).subscribe({
      next: () => {
        console.log('Item adicionado à lista com sucesso');
      },
      error: (err) => {
        console.error('Erro ao adicionar item à lista:', err);
      }
    });
  }

}
