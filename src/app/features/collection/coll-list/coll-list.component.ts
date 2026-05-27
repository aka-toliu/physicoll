import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CollectionService } from '../../../core/services/collection.service';
import { ICollectionItem } from '../../../shared/models/ICollection';
import { CardCollComponent } from '../../../shared/components/card-coll/card-coll.component';
import { IconComponent } from "../../../shared/components/icon/icon.component";
import { NgClass } from '@angular/common';
import { ECaseState } from '../../../shared/models/EItem';


@Component({
  selector: 'app-coll-list',
  standalone: true,
  imports: [CardCollComponent, IconComponent, NgClass],
  templateUrl: './coll-list.component.html',
  styleUrl: './coll-list.component.scss'
})
export class CollListComponent implements OnInit {


  private collectionService = inject(CollectionService);
  private uid = signal(localStorage.getItem('UID'));

  protected showFilters = signal(false);
  protected viewMode = signal<'grid' | 'list'>('list');

  public caseStateOptions = Object.keys(ECaseState) as Array<keyof typeof ECaseState>;
  public ECaseState = ECaseState;

  protected collection = signal<ICollectionItem[] | null>([]);

  protected searchQuery = signal<string>('');
  protected filterFormat = signal<string>('');
  protected sortCriterion = signal<string>('added-newest');

  protected filteredCollection = computed(() => {
    const list = this.collection() || [];
    const query = this.searchQuery().toLowerCase().trim();
    const format = this.filterFormat();
    const criterion = this.sortCriterion();

    let result = list.filter(item => {

      const matchesName = !query ||
        item.title?.toLowerCase().includes(query);

      const matchesFormat = !format ||
        item.format === format;

      return matchesName && matchesFormat;
    });

    return [...result].sort((a, b) => {
      switch (criterion) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');

        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');

        case 'acquisition-newest':
          return new Date(b.acquisitionDate || 0).getTime() - new Date(a.acquisitionDate || 0).getTime();

        case 'acquisition-oldest':
          return new Date(a.acquisitionDate || 0).getTime() - new Date(b.acquisitionDate || 0).getTime();

        case 'rating-highest':
          return (b.personalRating || 0) - (a.personalRating || 0);

        case 'rating-lowest':
          return (a.personalRating || 0) - (b.personalRating || 0);

        case 'added-newest':
          return new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime();

        case 'added-oldest':
          return new Date(a.addedAt || 0).getTime() - new Date(b.addedAt || 0).getTime();

        case 'year-newest':
          return +(b.year || 0) - +(a.year || 0);

        case 'year-oldest':
          return +(a.year || 0) - +(b.year || 0);

        default:
          return 0;
      }
    });
  });

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


  updateSearchQuery(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  updateFormat(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filterFormat.set(value);
  }

  updateSortCriterion(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortCriterion.set(value);
  }

  toggleFilters(): void {
    this.showFilters.update(show => !show);
  }

}
