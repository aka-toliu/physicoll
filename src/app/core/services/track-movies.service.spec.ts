import { TestBed } from '@angular/core/testing';

import { TrackMoviesService } from './track-movies.service';

describe('TrackMoviesService', () => {
  let service: TrackMoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackMoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
