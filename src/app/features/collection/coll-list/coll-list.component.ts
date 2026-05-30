import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CollectionService } from '../../../core/services/collection.service';
import { ICollectionItem } from '../../../shared/models/ICollection';
import { CardCollComponent } from '../../../shared/components/card-coll/card-coll.component';
import { IconComponent } from "../../../shared/components/icon/icon.component";
import { NgClass } from '@angular/common';
import { EBluRayCase, ECaseState, EDiscState, EDVDCase, ETapeState, EVHSCase } from '../../../shared/models/EItem';
import { ɵInternalFormsSharedModule } from "@angular/forms";
import { ELanguages } from '../../../shared/models/ELanguages';
import { ProfileService } from '../../../core/services/profile.service';


@Component({
  selector: 'app-coll-list',
  standalone: true,
  imports: [CardCollComponent, IconComponent, NgClass, ɵInternalFormsSharedModule],
  templateUrl: './coll-list.component.html',
  styleUrl: './coll-list.component.scss'
})
export class CollListComponent implements OnInit {


  private collectionService = inject(CollectionService);
  private uid = signal(localStorage.getItem('UID'));

  protected showFilters = signal(false);
  protected showSort = signal(false);
  protected viewMode = signal<'grid' | 'list'>(localStorage.getItem('viewMode') ? localStorage.getItem('viewMode') as 'grid' | 'list' : 'list');

  public caseStateOptions = Object.keys(ECaseState) as Array<keyof typeof ECaseState>;
  public discStateOptions = Object.keys(EDiscState) as Array<keyof typeof EDiscState>;
  public tapeStateOptions = Object.keys(ETapeState) as Array<keyof typeof ETapeState>;
  public caseDVDOptions = Object.keys(EDVDCase) as Array<keyof typeof EDVDCase>;
  public caseBluRayOptions = Object.keys(EBluRayCase) as Array<keyof typeof EBluRayCase>;
  public caseVHSOptions = Object.keys(EVHSCase) as Array<keyof typeof EVHSCase>;
  public ECaseState = ECaseState;
  public EDiscState = EDiscState;
  public ETapeState = ETapeState;
  public EDVDCase = EDVDCase;
  public EBluRayCase = EBluRayCase;
  public EVHSCase = EVHSCase;
  public ELanguages = ELanguages;


  protected collection = signal<ICollectionItem[] | null>([]);

  protected searchQuery = signal<string>('');
  protected filterFormat = signal<string>('');
  protected filterCaseState = signal<string>('');
  protected filterDiscState = signal<string>('');
  protected filterTapeState = signal<string>('');
  protected filterCaseType = signal<string>('');
  protected filterDirector = signal<string>('');
  protected filterGenre = signal<string>('');
  protected filterCountry = signal<string>('');
  protected filterIsSpecial = signal<boolean | null>(null);
  protected filterAvailableForSale = signal<boolean | null>(null);
  protected filterAvailableForExchange = signal<boolean | null>(null);
  protected filterSupplier = signal<string>('');
  protected filterEdition = signal<string>('');
  protected filterAudioLanguage = signal<string>('');
  protected filterSubtitleLanguage = signal<string>('');
  protected sortCriterion = signal<string>('added-newest');

  protected directors = computed(() => {
    const list = this.collection() || [];
    const allDirectors = list.flatMap(item => item.director || []);
    const directorsSet = new Set<string>(allDirectors);
    return Array.from(directorsSet).sort((a, b) => a.localeCompare(b));
  });

  protected suppliers = computed(() => {
    const list = this.collection() || [];
    const allSuppliers = list.flatMap(item => item.supplier || []);
    const suppliersSet = new Set<string>(allSuppliers);
    return Array.from(suppliersSet).sort((a, b) => a.localeCompare(b));
  });

  protected edition = computed(() => {
    const list = this.collection() || [];
    const allEditions = list.flatMap(item => item.edition || []);
    const suppliersSet = new Set<string>(allEditions);
    return Array.from(suppliersSet).sort((a, b) => a.localeCompare(b));
  });

  protected genres = computed(() => {
    const list = this.collection() || [];
    const allGenres = list.flatMap(item => item.genre || []);
    const genresSet = new Set<string>(allGenres);
    return Array.from(genresSet).sort((a, b) => a.localeCompare(b));
  });

  protected audioLanguages = computed(() => {
    const list = this.collection() || [];
    const allLanguages = list.flatMap(item => item.audioLanguage || []);
    const languagesSet = new Set<string>(allLanguages);
    return Array.from(languagesSet).sort((a, b) => a.localeCompare(b));
  });

  protected subtitleLanguages = computed(() => {
    const list = this.collection() || [];
    const allLanguages = list.flatMap(item => item.subtitleLanguage || []);
    const languagesSet = new Set<string>(allLanguages);
    return Array.from(languagesSet).sort((a, b) => a.localeCompare(b));
  });

  protected countries = computed(() => {
    const list = this.collection() || [];
    const allCountries = list.flatMap(item => item.country || []);
    const countriesSet = new Set<string>(allCountries);
    return Array.from(countriesSet).sort((a, b) => a.localeCompare(b));
  });

  protected activeFiltersCount = computed(() => {
    let count = 0;
    if (this.filterCaseState() !== '') count++;
    if (this.filterIsSpecial()) count++;
    if (this.filterAvailableForSale()) count++;
    if (this.filterAvailableForExchange()) count++;
    if (this.filterDirector() !== '') count++;
    if (this.filterGenre() !== '') count++;
    if (this.filterCountry() !== '') count++;
    if (this.filterDiscState() !== '') count++;
    if (this.filterTapeState() !== '') count++;
    if (this.filterCaseType() !== '') count++;
    if (this.filterSupplier() !== '') count++;
    if (this.filterEdition() !== '') count++;
    if (this.filterAudioLanguage() !== '') count++;
    if (this.filterSubtitleLanguage() !== '') count++;
    return count;
  });

  protected filteredCollection = computed(() => {
    const list = this.collection() || [];
    const query = this.searchQuery().toLowerCase().trim();
    const format = this.filterFormat();
    const especial = this.filterIsSpecial();
    const caseState = this.filterCaseState();
    const availableForSale = this.filterAvailableForSale();
    const availableForExchange = this.filterAvailableForExchange();
    const criterion = this.sortCriterion();
    const director = this.filterDirector();
    const genre = this.filterGenre();
    const country = this.filterCountry();
    const discState = this.filterDiscState();
    const tapeState = this.filterTapeState();
    const caseType = this.filterCaseType();
    const supplier = this.filterSupplier();
    const edition = this.filterEdition();
    const audioLanguage = this.filterAudioLanguage();
    const subtitleLanguage = this.filterSubtitleLanguage();
    let result = list.filter(item => {

      // Filtro por título (busca)
      const matchesName = !query ||
        item.title?.toLowerCase().includes(query);

      // Filtro por Formato
      const matchesFormat = !format ||
        item.format === format;

      // Filtro por Edição Especial
      const matchesEspecial = especial === null ||
        item.isSpecialEdition === especial;

      // Filtro por Estado da Capa
      const matchesCaseState = !caseState ||
        item.stateCase === caseState;

      // Filtro por Estado do Disco
      const matchesDiscState = !discState ||
        item.stateDisc === discState;

      // Filtro por Estado da Fita
      const matchesTapeState = !tapeState ||
        item.stateTape === tapeState;

      const matchesAvailableForSale = availableForSale === null ||
        item.availableForSell === availableForSale;

      const matchesAvailableForExchange = availableForExchange === null ||
        item.availableForExchange === availableForExchange;

      // Filtro por Diretor
      const matchesDirector = !director ||
        item.director?.includes(director);

      // Filtro por Gênero
      const matchesGenre = !genre ||
        item.genre?.includes(genre);

      // Filtro por País
      const matchesCountry = !country ||
        item.country?.includes(country);

      // Filtro por Tipo de Capa
      const matchesCaseType = !caseType ||
        item.caseType === caseType;

      // Filtro por Fornecedor
      const matchesSupplier = !supplier ||
        item.supplier === supplier;

      // Filtro por Edição      
      const matchesEdition = !edition ||
        item.edition === edition;

      // Filtro por Idioma de Áudio
      const matchesAudioLanguage = !audioLanguage ||
        item.audioLanguage?.includes(audioLanguage);

      // Filtro por Idioma de Legenda
      const matchesSubtitleLanguage = !subtitleLanguage ||
        item.subtitleLanguage?.includes(subtitleLanguage);

      return matchesName
        && matchesFormat
        && matchesEspecial
        && matchesCaseState
        && matchesAvailableForSale
        && matchesAvailableForExchange
        && matchesDirector
        && matchesGenre
        && matchesDiscState
        && matchesTapeState
        && matchesCountry
        && matchesCaseType
        && matchesSupplier
        && matchesEdition
        && matchesAudioLanguage
        && matchesSubtitleLanguage;

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

        case 'added-newest': {
          const timeA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
          const timeB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
          return timeB - timeA;
        }

        case 'added-oldest': {
          const timeA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
          const timeB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
          return timeA - timeB;
        }

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
        console.log(this.suppliers());
      },
      error: () => console.error('Erro ao obter coleção')
    });
  }

  updateValueFilter(event: Event, filterType: string): void {
    const value = (event.target as HTMLSelectElement).value;

    switch (filterType) {
      case 'search-query':
        this.searchQuery.set(value);
        break;
      case 'format':
        this.filterFormat.set(value);
        break;
      case 'case-state':
        this.filterCaseState.set(value);
        break;
      case 'disc-state':
        this.filterDiscState.set(value);
        break;
      case 'tape-state':
        this.filterTapeState.set(value);
        break;
      case 'director':
        this.filterDirector.set(value);
        break;
      case 'genre':
        this.filterGenre.set(value);
        break;
      case 'country':
        this.filterCountry.set(value);
        break;
      case 'case-type':
        this.filterCaseType.set(value);
        break;
      case 'supplier':
        this.filterSupplier.set(value);
        break;
      case 'edition':
        this.filterEdition.set(value);
        break;
      case 'audio-language':
        this.filterAudioLanguage.set(value);
        break;
      case 'subtitle-language':
        this.filterSubtitleLanguage.set(value);
        break;
    }
  }

  updateCheckboxFilter(event: Event, filterType: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    switch (filterType) {
      case 'isSpecialEdition':
        this.filterIsSpecial.set(isChecked ? true : null);
        break;
      case 'availableForSale':
        this.filterAvailableForSale.set(isChecked ? true : null);
        break;
      case 'availableForExchange':
        this.filterAvailableForExchange.set(isChecked ? true : null);
        break;
    }
  }

  updateSortCriterion(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortCriterion.set(value);
  }

  toggleFilters(type: string): void {
    if (type === 'filters') {
      this.showFilters.update(value => !value);
    }
    else if (type === 'sort') {
      this.showSort.update(value => !value);
    }
  }

  clearAllFilters(): void {
    this.filterIsSpecial.set(null);
    this.filterAvailableForSale.set(null);
    this.filterAvailableForExchange.set(null);
    this.filterDirector.set('');
    this.filterGenre.set('');
    this.filterCaseState.set('');
    this.filterDiscState.set('');
    this.filterTapeState.set('');
    this.filterCountry.set('');
    this.filterSupplier.set('');
    this.filterEdition.set('');
    this.filterAudioLanguage.set('');
    this.filterSubtitleLanguage.set('');
  }

  changeViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
    localStorage.setItem('viewMode', mode);
  }

}
