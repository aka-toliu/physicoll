import { Component, inject, signal } from '@angular/core';
import { ListsService } from '../../../core/services/lists.service';
import { IItemList, IList } from '../../../shared/models/ILists';
import { CardListComponent } from '../../../shared/components/card-list/card-list.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { IProfile } from '../../../shared/models/IProfile';

@Component({
  selector: 'app-lists-list',
  standalone: true,
  imports: [CardListComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './lists-list.component.html',
  styleUrl: './lists-list.component.scss'
})
export class ListsListComponent {

  private listsService = inject(ListsService);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  private uid = signal(localStorage.getItem('UID'));
  public userData = signal<IProfile | null | undefined>(undefined);
  protected isMyself = signal(true);

  private routeSubscription!: Subscription;

  protected lists = signal<IList[]>([]); // 🟢 Mudou de toSignal para signal normal
  protected modalNovaLista = signal<boolean>(false);
  protected formList!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
    this.onCheckProfile();
    console.log('ngOnInit chamado');
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getLists(uid: string): void {
    this.listsService.getUserLists(uid).subscribe({
      next: (lists) => {
        this.lists.set(lists);
        console.log('Listas:', lists);
      },
      error: (err) => {
        console.error('Erro ao buscar listas:', err);
      }
    });
  }

  onCheckProfile(): void {
    console.log('onCheckProfile called');
    this.routeSubscription = this.activatedRoute.params.subscribe({
      next: (params) => {
        const uid = params['userId'];
        if (uid) {
          this.onGetProfileByUsername(uid);
          console.log(uid);
        } else {
          this.isMyself.set(true);
          this.getLists(this.uid()!);
        }
      }
    });
  }

  onGetProfileByUsername(username: string): void {
    this.profileService.getProfileByUsername(username).subscribe({
      next: (profile) => {
        this.userData.set(profile);
        console.log('profile', profile);
        this.checkIsMyself(this.authService.userData().uid, profile.uid);
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/not-found']);
      }
    });
  }

  checkIsMyself(uid1: string, uid2: string) {
    if (uid1 === uid2) {
      this.isMyself.set(true);
      this.getLists(this.userData()!.uid);
      console.log('Sou eu mesmo');
    } else {
      this.isMyself.set(false);
      this.getLists(this.userData()!.uid);
      console.log('Não sou eu');
    }
  }

  buildForm(): void {
    this.formList = this.formBuilder.group({
      title: [''],
      isPrivated: [false],
      items: [[]],
      icon: ['list'],
      isRanked: [false]
    });
  }

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
