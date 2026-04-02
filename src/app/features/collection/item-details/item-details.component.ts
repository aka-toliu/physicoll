import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CollectionService } from '../../../core/services/collection.service';
import { ICollectionItem } from '../../../shared/models/ICollection';


@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [NgClass, IconComponent, DatePipe, CurrencyPipe],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss'
})
export class ItemDetailsComponent {

  private activatedRoute = inject(ActivatedRoute);
  private collectionService = inject(CollectionService);

  protected item = signal<ICollectionItem | null>(null);

  ngOnInit(): void {
    this.getItem();
  }

  getItem(){
    const uid = localStorage.getItem('UID');
    const itemId = this.activatedRoute.snapshot.params['itemID'];

    this.collectionService.getCollectionItem(uid, itemId).subscribe({
      next: (item) => {
        this.item.set(item);
        console.log(item);
        
      },
      error: (err) => {
        console.error('Error ao buscar detalhes do item:', err);
      }
    })
    
  }

}
