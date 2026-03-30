import { Component, inject, OnInit, signal } from '@angular/core';
import { CollectionService } from '../../../core/services/collection.service';
import { ICollectionItem } from '../../../shared/models/ICollection';
import { CardCollComponent } from '../../../shared/components/card-coll/card-coll.component';

@Component({
  selector: 'app-coll-list',
  standalone: true,
  imports: [CardCollComponent],
  templateUrl: './coll-list.component.html',
  styleUrl: './coll-list.component.scss'
})
export class CollListComponent implements OnInit {


  private collectionService = inject(CollectionService);
  private uid = signal(localStorage.getItem('UID'));

  protected collection = signal<ICollectionItem[] | null>([]);

  ngOnInit(): void {
    this.getCollection();
  }

  getCollection() {
    this.collectionService.getCollection(this.uid()).subscribe({
      next: (collection) => {
        this.collection.set(collection),
        console.log(collection);
      },
      error: () => console.error('Erro ao obter coleção')
    });
  }

}
