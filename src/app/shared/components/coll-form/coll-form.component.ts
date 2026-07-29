import { Component, ElementRef, HostListener, inject, input, model, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { IconComponent } from '../icon/icon.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgStyle, CommonModule } from '@angular/common';
import { EBluRayCase, ECaseState, EDiscState, EDVDCase, EFormat, EResolution, ETapeState, EVHSCase } from '../../models/EItem';
import { CollectionService } from '../../../core/services/collection.service';
import { ITMDBMovieDetail, IMovieTrack } from '../../models/IMovies';
import { animate, style, transition, trigger } from '@angular/animations';
import { ELanguages } from '../../models/ELanguages';
import { ICollectionItem } from '../../models/ICollection';
import { ProfileService } from '../../../core/services/profile.service';
import { TrackMoviesService } from '../../../core/services/track-movies.service';
import { MoviesService } from '../../../core/services/movies.service';

@Component({
  selector: 'app-coll-form',
  standalone: true,
  imports: [NgStyle, CommonModule, ReactiveFormsModule, NgxMaskDirective, IconComponent],
  templateUrl: './coll-form.component.html',
  styleUrl: './coll-form.component.scss',
  animations: [
    trigger('moveForm', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate('300ms ease-in', style({ transform: 'translateY(100%)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CollFormComponent implements OnInit, OnChanges {

  public modalControl = model<boolean>();
  public modalClose = output<boolean>();
  public updateItem = output<boolean>();
  
  public movieDetails = input<ITMDBMovieDetail | null>(null);
  public itemDetails = input<ICollectionItem | null>(null);

  private uid = signal(localStorage.getItem('UID'));

  // FORM
  protected formItem!: FormGroup;
  private formBuilder = inject(FormBuilder);

  // SERVICES
  private collectionService = inject(CollectionService);
  private profileService = inject(ProfileService);
  private trackMoviesService = inject(TrackMoviesService);
  private moviesService = inject(MoviesService);
  protected elementRef = inject(ElementRef);

  // ENUMS
  public caseDVDOptions = Object.keys(EDVDCase) as Array<keyof typeof EDVDCase>;
  public caseBluRayOptions = Object.keys(EBluRayCase) as Array<keyof typeof EBluRayCase>;
  public caseVHSOptions = Object.keys(EVHSCase) as Array<keyof typeof EVHSCase>;
  public formatOptions = Object.keys(EFormat) as Array<keyof typeof EFormat>;
  public caseStateOptions = Object.keys(ECaseState) as Array<keyof typeof ECaseState>;
  public discStateOptions = Object.keys(EDiscState) as Array<keyof typeof EDiscState>;
  public tapeStateOptions = Object.keys(ETapeState) as Array<keyof typeof ETapeState>;
  public resolutionOptions = Object.keys(EResolution) as Array<keyof typeof EResolution>;
  public languageOptions = Object.keys(ELanguages) as Array<keyof typeof ELanguages>;
  public EFormat = EFormat;
  public ELanguages = ELanguages;
  public ECaseState = ECaseState;
  public EDiscState = EDiscState;
  public ETapeState = ETapeState;
  public EDVDCase = EDVDCase;
  public EBluRayCase = EBluRayCase;
  public EVHSCase = EVHSCase;

  public starRating = signal<number[]>([0, 0, 0, 0, 0]);

  protected audioOpenDropdown = signal<boolean>(false);
  protected subtitleOpenDropdown = signal<boolean>(false);

  ngOnInit(): void {
    this.onBuildForm();
    this.onPatchForm();
    this.setupFormListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['movieDetails'] && this.movieDetails()) || (changes['itemDetails'] && this.itemDetails())) {
      this.onPatchForm();
    }
  }

  rating(star: number) {
    this.starRating.set(Array(star).fill(1).concat(Array(5 - star).fill(0)));
    this.formItem.controls['personalRating'].setValue(star);
  }

  onBuildForm() {
    this.formItem = this.formBuilder.group({
      tmdbID: [null],
      imdbID: [null],
      title: [null],
      year: [null],
      poster: [null],
      director: [[]],
      genre: [[]],
      actors: [[]],
      writer: [[]],
      country: [[]],
      originalLanguage: [[]],
      format: [EFormat.DVD],
      hasMoreThanOneDisc: [false],
      numberDiscs: [{ value: 1, disabled: true }],
      caseType: [''],
      stateCase: [null],
      stateDisc: [null],
      stateTape: [null],
      storageLocation: [null],
      acquisitionDate: [null],
      acquisitionPrice: [0],
      supplier: [null],
      availableForExchange: [false],
      availableForSell: [false],
      isLoaned: [false],
      isSpecialEdition: [false],
      audioLanguage: [[]],
      subtitleLanguage: [[]],
      edition: [{ value: '', disabled: true }],
      resolution: [null],
      isFavorite: [false],
      watched: [false],
      lastWatchedDate: [null],
      personalRating: [0],
      observations: [null],
      addedAt: [new Date().toISOString()]
    });
  }

  private setupFormListeners() {
    this.formItem.get('isSpecialEdition')?.valueChanges.subscribe((value) => {
      this.toggleSpecialEdition(value);
    });

    this.formItem.get('hasMoreThanOneDisc')?.valueChanges.subscribe((value) => {
      this.toggleNumberDiscs(value);
    });
  }

onPatchForm() {
  if (!this.formItem) return;

  const movie = this.movieDetails();
  const item = this.itemDetails();

  if (movie) {
    const directors = movie.credits?.crew
      ? movie.credits.crew.filter(c => c.job === 'Director').map(c => c.name)
      : [];
    const genres = movie.genres ? movie.genres.map(g => g.name) : [];
    const actors = movie.credits?.cast ? movie.credits.cast.slice(0, 5).map(a => a.name) : [];
    const countries = movie.production_countries ? movie.production_countries.map(c => c.name) : [];

    this.formItem.patchValue({
      tmdbID: movie.id ?? null,
      imdbID: movie.imdb_id || movie.id?.toString() || null,
      title: movie.title || null,
      year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      poster: this.moviesService.getImageUrl(movie.poster_path, 'w500'),
      director: directors,
      genre: genres,
      actors: actors,
      writer: [],
      country: countries,
      originalLanguage: movie.original_language ? [movie.original_language] : []
    });
  }

  if (item) {
    this.formItem.patchValue({
      tmdbID: item.tmdbID || null,
      imdbID: item.imdbID || null,
      title: item.title,
      year: item.year,
      poster: item.poster,
      director: item.director || [],
      genre: item.genre || [],
      actors: item.actors || [],
      writer: item.writer || [],
      country: item.country || [],
      originalLanguage: item.originalLanguage || [],
      format: item.format,
      hasMoreThanOneDisc: item.hasMoreThanOneDisc ?? false,
      numberDiscs: item.numberDiscs ?? 1,
      caseType: item.caseType,
      stateCase: item.stateCase,
      stateDisc: item.stateDisc,
      stateTape: item.stateTape,
      storageLocation: item.storageLocation,
      acquisitionDate: item.acquisitionDate,
      acquisitionPrice: item.acquisitionPrice,
      supplier: item.supplier,
      availableForExchange: item.availableForExchange ?? false,
      availableForSell: item.availableForSell ?? false,
      isLoaned: item.isLoaned ?? false,
      isSpecialEdition: item.isSpecialEdition ?? false,
      audioLanguage: item.audioLanguage || [],
      subtitleLanguage: item.subtitleLanguage || [],
      edition: item.edition || '',
      resolution: item.resolution,
      isFavorite: item.isFavorite ?? false,
      watched: item.watched ?? false,
      lastWatchedDate: item.lastWatchedDate,
      personalRating: item.personalRating ?? 0,
      observations: item.observations,
      addedAt: item.addedAt || new Date().toISOString()
    });

    this.rating(item.personalRating || 0);
  }

  this.toggleSpecialEdition(this.formItem.get('isSpecialEdition')?.value);
  this.toggleNumberDiscs(this.formItem.get('hasMoreThanOneDisc')?.value);
}

  toggleSpecialEdition(isSpecialEdition: boolean) {
    const editionControl = this.formItem.get('edition');
    if (isSpecialEdition) {
      editionControl?.enable({ emitEvent: false });
    } else {
      editionControl?.disable({ emitEvent: false });
      editionControl?.setValue('', { emitEvent: false });
    }
  }

  toggleNumberDiscs(hasMoreThanOneDisc: boolean) {
    const numberDiscsControl = this.formItem.get('numberDiscs');
    if (hasMoreThanOneDisc) {
      numberDiscsControl?.enable({ emitEvent: false });
    } else {
      numberDiscsControl?.disable({ emitEvent: false });
      numberDiscsControl?.setValue(1, { emitEvent: false });
    }
  }

  addAudioLanguage(event: Event, language: string): void {
    event.preventDefault();
    const currentLanguages: string[] = this.formItem.controls['audioLanguage'].value || [];

    if (currentLanguages.includes(language)) {
      const updatedLanguages = currentLanguages.filter(lang => lang !== language);
      this.formItem.controls['audioLanguage'].setValue(updatedLanguages);
    } else {
      this.formItem.controls['audioLanguage'].setValue([...currentLanguages, language]);
    }
  }

  addSubtitleLanguage(event: Event, language: string): void {
    event.preventDefault();
    const currentLanguages: string[] = this.formItem.controls['subtitleLanguage'].value || [];

    if (currentLanguages.includes(language)) {
      const updatedLanguages = currentLanguages.filter(lang => lang !== language);
      this.formItem.controls['subtitleLanguage'].setValue(updatedLanguages);
    } else {
      this.formItem.controls['subtitleLanguage'].setValue([...currentLanguages, language]);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const chipSelectContainer = target.closest('.chip-select');

    if (this.audioOpenDropdown() && !chipSelectContainer) {
      this.audioOpenDropdown.set(false);
    }

    if (this.subtitleOpenDropdown() && !chipSelectContainer) {
      this.subtitleOpenDropdown.set(false);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const userUid = this.uid();
    if (!userUid) return;

    // getRawValue inclui os campos mesmo se estiverem disabled
    const payload = this.formItem.getRawValue();

    if (this.movieDetails()) {
      this.collectionService.addToCollection(userUid, payload).subscribe({
        next: () => {
          console.log('Item adicionado à coleção com sucesso!');
          this.addCount(this.movieDetails());
          this.modalClose.emit(false);
        },
        error: () => console.error('Erro ao adicionar item à coleção')
      });
    }

    if (this.itemDetails()) {
      this.collectionService.editCollectionItem(userUid, this.itemDetails()?.id || '', payload).subscribe({
        next: () => {
          console.log('Item editado com sucesso!');
          this.modalClose.emit(false);
          this.updateItem.emit(true);
        },
        error: () => console.error('Erro ao editar item da coleção')
      });
    }
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.modalControl.set(false);
    this.modalClose.emit(false);
  }

  addCount(movie: ITMDBMovieDetail | null) {
    if (!movie) return;

    const movieTrack: IMovieTrack = {
      tmdbID: movie.id,
      imdbID: movie.imdb_id || movie.id.toString(),
      title: movie.title,
      poster: this.moviesService.getImageUrl(movie.poster_path, 'w500'),
      searchCount: 0,
      collectedCount: 1,
      wishedCount: 0
    };

    this.trackMoviesService.addCountMovieCollected(movieTrack).subscribe({
      next: () => {
        console.log('Contagem de coleção atualizada com sucesso');
      },
      error: (err) => {
        console.error('Erro ao atualizar contagem de coleção:', err);
      }
    });
  }
}