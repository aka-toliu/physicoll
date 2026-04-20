import { AfterContentInit, Component, inject, input, model, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { IconComponent } from '../icon/icon.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgStyle, CommonModule } from '@angular/common';
import { EBluRayCase, ECaseState, EDiscState, EDVDCase, EFormat, EResolution, ETapeState, EVHSCase } from '../../models/EItem';
import { CollectionService } from '../../../core/services/collection.service';
import { IMovieDetail } from '../../models/IMovies';
import { animate, style, transition, trigger } from '@angular/animations';

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
  public movieDetails = input<IMovieDetail | null>(null);

  private uid = signal(localStorage.getItem('UID'));

  // FORM
  protected formItem!: FormGroup;
  private formBuilder = inject(FormBuilder);

  // SERVICES
  private collectionService = inject(CollectionService);

  // ENUMS
  public caseDVDOptions = Object.keys(EDVDCase) as Array<keyof typeof EDVDCase>;
  public caseBluRayOptions = Object.keys(EBluRayCase) as Array<keyof typeof EBluRayCase>;
  public caseVHSOptions = Object.keys(EVHSCase) as Array<keyof typeof EVHSCase>;
  public formatOptions = Object.keys(EFormat) as Array<keyof typeof EFormat>;
  public caseStateOptions = Object.keys(ECaseState) as Array<keyof typeof ECaseState>;
  public discStateOptions = Object.keys(EDiscState) as Array<keyof typeof EDiscState>;
  public tapeStateOptions = Object.keys(ETapeState) as Array<keyof typeof ETapeState>;
  public resolutionOptions = Object.keys(EResolution) as Array<keyof typeof EResolution>;
  public EFormat = EFormat;
  public ECaseState = ECaseState;
  public EDiscState = EDiscState;
  public ETapeState = ETapeState;
  public EDVDCase = EDVDCase;
  public EBluRayCase = EBluRayCase;
  public EVHSCase = EVHSCase;

  public starRating = signal<number[]>([0, 0, 0, 0, 0]);


  ngOnInit(): void {
    this.onBuildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movieDetails'] && this.movieDetails()) {
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
      addedAt: [new Date()]
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

    this.toggleSpecialEdition(this.formItem.controls['edition'].value);
    this.toggleNumberDiscs(this.formItem.controls['hasMoreThanOneDisc'].value);

    this.formItem.get('isSpecialEdition')?.valueChanges.subscribe((value) => {
      this.toggleSpecialEdition(value);
    });

    this.formItem.get('hasMoreThanOneDisc')?.valueChanges.subscribe((value) => {
      this.toggleNumberDiscs(value);
    });
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

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.formItem.value);
    // this.collectionService.addToCollection(this.uid(), this.formItem.value).subscribe({
    //   next: () => {
    //     console.log('Item adicionado à coleção com sucesso!');
    //     this.modalClose.emit(false);
    //   },
    //   error: () => console.error('Erro ao adicionar item à coleção')
    // })
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.modalControl.set(false);
    this.modalClose.emit(false);
  }

}
