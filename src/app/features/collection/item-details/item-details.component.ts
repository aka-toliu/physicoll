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
import { AuthService } from '../../../core/services/auth.service';
import { IProfile } from '../../../shared/models/IProfile';
import { Subscription } from 'rxjs';



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
  private authService = inject(AuthService);
  public userData = signal<IProfile | null | undefined>(undefined);
  protected isMyself = signal(true);
  private routeSubscription!: Subscription;



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
    // this.getItem();
    this.onCheckProfile();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onCheckProfile(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe({
      next: (params) => {
        const username = params['userId'];
        const itemId = params['itemID'];

        if (username) {
          this.onGetProfileByUsername(username, itemId);
        } else {
          this.isMyself.set(true);
          this.getItem(this.uid()!, itemId);
        }
      }
    });
  }


  onGetProfileByUsername(username: string, itemId: string): void {
    this.profileService.getProfileByUsername(username).subscribe({
      next: (profile) => {

        if (!profile) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.userData.set(profile);

        const myLoggedUid = this.authService.userData()?.uid || this.uid();

        this.checkIsMyself(myLoggedUid!, profile.uid, itemId);
      },
      error: (err) => {
        console.error('Erro ao buscar perfil:', err);
        this.router.navigate(['/not-found']);
      }
    });
  }


  checkIsMyself(uid1: string, uid2: string, itemId: string) {
    if (uid1 === uid2) {
      this.isMyself.set(true);
      this.getItem(this.userData()!.uid, itemId);
    } else {
      this.isMyself.set(false);
      this.getItem(this.userData()!.uid, itemId);
    }
  }


getItem(uid?: string, itemId?: string) {
  // Pega o uid do perfil carregado ou o seu próprio
  const targetUid = uid || this.userData()?.uid || this.uid();
  // Pega o itemId do item atual ou da rota
  const targetItemId = itemId || this.item()?.id || this.activatedRoute.snapshot.params['itemID'];

  if (!targetUid || !targetItemId) return;

  this.collectionService.getCollectionItem(targetUid, targetItemId).subscribe({
    next: (item) => {
      if (item) {
        this.stars = Array(item.personalRating || 0).fill(1).concat(Array(5 - (item.personalRating || 0)).fill(0));
        this.item.set(item);
      }
    },
    error: (err) => {
      console.error('Erro ao buscar detalhes do item:', err);
    }
  });
}

  deleteItem() {
    if (!this.isMyself()) return;
    const uid = localStorage.getItem('UID');
    const itemId = this.item()?.id;

    if (!uid || !itemId) return;
    this.collectionService.deleteCollectionItem(uid, itemId).subscribe({
      next: () => {
        console.log('Item deletado com sucesso');
        this.router.navigate(['/coll']);
      },
      error: (err) => {
        console.error('Erro ao deletar item:', err);
      }
    });
  }

  getLabel(value: any, enumObj: any): string {
    return enumObj[value] || value;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onBack(){
    window.history.back();
  }

  toggleOptions(event: Event) {
    event.stopPropagation();
    this.showOptions.set(!this.showOptions());
  }

  getLists(): void {
    this.listsService.getUserLists(this.userData()?.uid || '').subscribe({
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
