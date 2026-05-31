import { AfterContentInit, Component, ElementRef, HostListener, inject, input, model, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { IconComponent } from '../icon/icon.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgStyle, CommonModule } from '@angular/common';
import { EBluRayCase, ECaseState, EDiscState, EDVDCase, EFormat, EResolution, ETapeState, EVHSCase } from '../../models/EItem';
import { CollectionService } from '../../../core/services/collection.service';
import { IMovieDetail, IMovieResult, IMovieTrack } from '../../models/IMovies';
import { animate, style, transition, trigger } from '@angular/animations';
import { ELanguages } from '../../models/ELanguages';
import { ICollectionItem } from '../../models/ICollection';
import { ProfileService } from '../../../core/services/profile.service';
import { TrackMoviesService } from '../../../core/services/track-movies.service';

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

export class CollFormComponent implements OnChanges {

  public modalControl = model<boolean>();
  public modalClose = output<boolean>();
  public updateItem = output<boolean>();
  public movieDetails = input<IMovieDetail | null>(null);
  public itemDetails = input<ICollectionItem | null>(null);

  private uid = signal(localStorage.getItem('UID'));

  // FORM
  protected formItem!: FormGroup;
  private formBuilder = inject(FormBuilder);

  // SERVICES
  private collectionService = inject(CollectionService);
  private profileService = inject(ProfileService);
  private trackMoviesService = inject(TrackMoviesService);
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movieDetails'] && this.movieDetails()) {
      this.onPatchForm();
    }
    if (changes['itemDetails'] && this.itemDetails()) {
      this.onPatchForm();
    }
  }


  rating(star: number) {
    this.starRating.set(Array(star).fill(1).concat(Array(5 - star).fill(0)));
    this.formItem.controls['personalRating'].setValue(star);
  }

  onBuildForm() {
    this.formItem = this.formBuilder.group({
      imdbID: [null],
      title: [null],
      year: [null],
      poster: [null],
      director: [null],
      genre: [null],
      actors: [null],
      writer: [null],
      country: [null],
      originalLanguage: [null],
      format: [EFormat.DVD],
      hasMoreThanOneDisc: [false],
      numberDiscs: [1],
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
      audioLanguage: [null],
      subtitleLanguage: [null],
      edition: [null],
      resolution: [null],
      isFavorite: [false],
      watched: [false],
      lastWatchedDate: [null],
      personalRating: [0],
      observations: [null],
      addedAt: [new Date().toISOString()]
    });
  }

  onPatchForm() {
    if (this.movieDetails()) {
      this.formItem.patchValue({
        imdbID: this.movieDetails()?.imdbID,
        title: this.movieDetails()?.Title,
        year: this.movieDetails()?.Year,
        poster: this.movieDetails()?.Poster,
        director: this.movieDetails()?.Director ? this.movieDetails()?.Director.split(',').map((d: string) => d.trim()) : null,
        genre: this.movieDetails()?.Genre ? this.movieDetails()?.Genre.split(',').map((g: string) => g.trim()) : null,
        actors: this.movieDetails()?.Actors ? this.movieDetails()?.Actors.split(',').map((a: string) => a.trim()) : null,
        writer: this.movieDetails()?.Writer ? this.movieDetails()?.Writer.split(',').map((w: string) => w.trim()) : null,
        country: this.movieDetails()?.Country ? this.movieDetails()?.Country.split(',').map((c: string) => c.trim()) : null,
        originalLanguage: this.movieDetails()?.Language ? this.movieDetails()?.Language.split(',').map((l: string) => l.trim()) : null
      });
    }

    if (this.itemDetails()) {
      this.formItem.patchValue({
        imdbID: this.itemDetails()?.imdbID,
        title: this.itemDetails()?.title,
        year: this.itemDetails()?.year,
        poster: this.itemDetails()?.poster,
        director: this.itemDetails()?.director,
        genre: this.itemDetails()?.genre,
        actors: this.itemDetails()?.actors,
        writer: this.itemDetails()?.writer,
        country: this.itemDetails()?.country,
        originalLanguage: this.itemDetails()?.originalLanguage,
        format: this.itemDetails()?.format,
        hasMoreThanOneDisc: this.itemDetails()?.hasMoreThanOneDisc,
        numberDiscs: this.itemDetails()?.numberDiscs,
        caseType: this.itemDetails()?.caseType,
        stateCase: this.itemDetails()?.stateCase,
        stateDisc: this.itemDetails()?.stateDisc,
        stateTape: this.itemDetails()?.stateTape,
        storageLocation: this.itemDetails()?.storageLocation,
        acquisitionDate: this.itemDetails()?.acquisitionDate,
        acquisitionPrice: this.itemDetails()?.acquisitionPrice,
        supplier: this.itemDetails()?.supplier,
        availableForExchange: this.itemDetails()?.availableForExchange,
        availableForSell: this.itemDetails()?.availableForSell,
        isLoaned: this.itemDetails()?.isLoaned,
        isSpecialEdition: this.itemDetails()?.isSpecialEdition,
        audioLanguage: this.itemDetails()?.audioLanguage,
        subtitleLanguage: this.itemDetails()?.subtitleLanguage,
        edition: this.itemDetails()?.edition,
        resolution: this.itemDetails()?.resolution,
        isFavorite: this.itemDetails()?.isFavorite,
        watched: this.itemDetails()?.watched,
        lastWatchedDate: this.itemDetails()?.lastWatchedDate,
        personalRating: this.itemDetails()?.personalRating,
        observations: this.itemDetails()?.observations,
        addedAt: this.itemDetails()?.addedAt
      });

      this.rating(this.itemDetails()?.personalRating || 0);
    }

    this.toggleSpecialEdition(this.formItem.controls['edition'].value);
    this.toggleNumberDiscs(this.formItem.controls['hasMoreThanOneDisc'].value);

    this.formItem.get('isSpecialEdition')?.valueChanges.subscribe((value) => {
      this.toggleSpecialEdition(value);
    });

    this.formItem.get('hasMoreThanOneDisc')?.valueChanges.subscribe((value) => {
      this.toggleNumberDiscs(value);
    });

    console.log('Item Details:', this.formItem.value);

  }

  toggleSpecialEdition(isSpecialEdition: boolean) {
    const editionControl = this.formItem.get('edition');
    if (isSpecialEdition) {
      editionControl?.enable();
    } else {
      editionControl?.disable();
      editionControl?.setValue('');
    }
  }

  toggleNumberDiscs(hasMoreThanOneDisc: boolean) {
    const numberDiscsControl = this.formItem.get('numberDiscs');
    if (hasMoreThanOneDisc) {
      numberDiscsControl?.enable();
    } else {
      numberDiscsControl?.disable();
      numberDiscsControl?.setValue(1);
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
    console.log(this.formItem.value);

    if (this.movieDetails()) {
      this.collectionService.addToCollection(this.uid(), this.formItem.value).subscribe({
        next: () => {
          console.log('Item adicionado à coleção com sucesso!');
          this.addCount(this.movieDetails())
          this.modalClose.emit(false);
        },
        error: () => console.error('Erro ao adicionar item à coleção')
      })
    }

    if (this.itemDetails()) {
      this.collectionService.editCollectionItem(this.uid(), this.itemDetails()?.id || '', this.formItem.value).subscribe({
        next: () => {
          console.log('Item editado com sucesso!');
          this.modalClose.emit(false);
          this.updateItem.emit(true);
        },
        error: () => console.error('Erro ao editar item da coleção')
      })
    }
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.modalControl.set(false);
    this.modalClose.emit(false);
  }

  addCount(movie: IMovieResult | null) {

    const movieTrack = {
      poster: movie?.Poster,
      imdbID: movie?.imdbID,
      title: movie?.Title
    }

    this.trackMoviesService.addCountMovieCollected(movieTrack as IMovieTrack).subscribe({
      next: () => {
        console.log('Contagem de busca atualizada com sucesso');
      },
      error: (err) => {
        console.error('Erro ao atualizar contagem de busca:', err);
      }
    });
  }


}
