import { Component, inject, OnInit, signal } from '@angular/core';
import { MoviesService } from '../../../core/services/movies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IItem, IMovieDetail } from '../../../shared/models/IMovies';
import { CommonModule, NgStyle } from '@angular/common';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ECaseState, EDiscCase, EDiscState, EFormat, EResolution, ETapeState, EVHSCase } from '../../../shared/models/EItem';
import { NgxMaskDirective } from 'ngx-mask';
import { IconComponent } from '../../../shared/components/icon/icon.component';



@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [NgStyle, CommonModule, ReactiveFormsModule, NgxMaskDirective, IconComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private moviesService = inject(MoviesService);
  private formBuilder = inject(FormBuilder);

  protected loading = false;
  protected movie = signal<IMovieDetail | null>(null);

  formItem!: FormGroup;

  public modalItemDetailsOpen = signal(false);
  public caseDiscOptions = Object.values(EDiscCase);
  public caseVHSOptions = Object.values(EVHSCase);
  public formatOptions = Object.values(EFormat);
  public caseStateOptions = Object.values(ECaseState);
  public discStateOptions = Object.values(EDiscState);
  public tapeStateOptions = Object.values(ETapeState);
  public resolutionOptions = Object.values(EResolution);
  public EFormat = EFormat;
  
  ngOnInit(): void {
    this.onGetMovieDetails();
    this.onBuildForm();
  }

  onBuildForm() {
    this.formItem = this.formBuilder.group({
      imdbID: [null],
      format: [EFormat.DVD],
      edition: [null],
      audioLanguage: [null],
      subtitleLanguage: [null],
      numberDiscs: [1],
      caseType: [''],
      stateCase: [null],
      stateDisc: [null],
      stateTape: [null],
      storageLocation: [null],
      acquisitionDate: [null],
      acquisitionPrice: [0],
      supplier: [null],
      isFavorite: [false],
      watched: [false],
      personalRating: [0],
      observations: [null]
    });
  }

  onGetMovieDetails() {
      this.activatedRoute.params.subscribe(params => {
      const movieId = params['id'];
      if (movieId) {
        this.moviesService.getMovie(movieId).subscribe({
          next: (movie) => {
            this.movie.set(movie);
            this.formItem.patchValue({
              imdbID: movie.imdbID,
            });
            this.loading = false;
          },
          error: (err) => {
            console.error('Error:', err);
          }
        });
      }
    });
  }

  onCancel(event: Event) {
    event.preventDefault();
    this.modalItemDetailsOpen.set(false);
  }

  onSubmit(event: Event){
    event.preventDefault();
    console.log(this.formItem.value);
    
  }

  onBack() {
    this.router.navigate(['/search']);
  }


}
