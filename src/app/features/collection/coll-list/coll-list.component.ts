import { Component, inject, OnInit, signal } from '@angular/core';
import { CollectionService } from '../../../core/services/collection.service';
import { ICollectionItem } from '../../../shared/models/ICollection';

@Component({
  selector: 'app-coll-list',
  standalone: true,
  imports: [],
  templateUrl: './coll-list.component.html',
  styleUrl: './coll-list.component.scss'
})
export class CollListComponent implements OnInit {


  private collectionService = inject(CollectionService);
  private uid = signal(localStorage.getItem('UID'));

  protected collection = signal<ICollectionItem[]>([]);

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
