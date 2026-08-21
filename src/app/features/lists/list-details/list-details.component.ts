import { Component, inject, signal, SimpleChanges } from '@angular/core';
import type { IProfile } from '../../../shared/models/IProfile';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListsService } from '../../../core/services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IList } from '../../../shared/models/ILists';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CardMovieListComponent } from '../../../shared/components/card-movie-list/card-movie-list.component';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-details',
  standalone: true,
  imports: [IconComponent, CardMovieListComponent, DragDropModule, NgClass, ReactiveFormsModule, ModalComponent],
  templateUrl: './list-details.component.html',
  styleUrl: './list-details.component.scss'
})
export class ListDetailsComponent {

  private listsService = inject(ListsService);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);

  private uid = signal(localStorage.getItem('UID'));
  public userData = signal<IProfile | null | undefined>(undefined);
  protected isMyself = signal(true);
  private routeSubscription!: Subscription;
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  public isLoading = signal(true);

  protected formItem: FormGroup = this.formBuilder.group({
    title: [''],
    isPrivated: [false],
    isRanked: [false],
    icon: ['list']
  });

  protected list = signal<IList | null>(null);
  public editMode = signal<boolean>(false);
  protected modalDeleteList = signal<boolean>(false);

  ngOnInit(): void {
    this.onCheckProfile();
  }

  getListDetails(uid: string): void {

    const listId = this.activatedRoute.snapshot.paramMap.get('listID');

    this.listsService.getListById(listId!, uid).subscribe({
      next: (list) => {
        if (list) {
          console.log('Detalhes da lista:', list);
          this.list.set(list);

          this.formItem.patchValue({
            title: list.title || '',
            isPrivated: list.isPrivated || false,
            isRanked: list.isRanked || false,
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
          this.getListDetails(this.uid()!);
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
      this.getListDetails(this.userData()!.uid);
      console.log('Sou eu mesmo');
      this.isLoading.set(false);
    } else {
      this.isMyself.set(false);
      this.getListDetails(this.userData()!.uid);
      console.log('Não sou eu', this.isMyself());
      this.isLoading.set(false);
    }
  }

  saveNewOrder(): void {
    const currentList = this.list();
    if (currentList?.id) {

      const dadosAtualizados: Partial<IList> = {
        title: this.formItem.get('title')?.value || currentList.title,
        items: currentList.items,
        isPrivated: this.formItem.get('isPrivated')?.value ?? currentList.isPrivated,
        isRanked: this.formItem.get('isRanked')?.value ?? currentList.isRanked,
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
        isRanked: this.list()?.isRanked,
        icon: this.list()?.icon
      });
    }
  }

  deleteList(): void {
    const currentList = this.list();
    if (currentList?.id) {
      this.listsService.deleteList(currentList.id).subscribe({
        next: () => {
          this.router.navigate(['/lists']);
          console.log('Lista deletada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao deletar a lista:', err);
        }
      });
    }
  }


}
