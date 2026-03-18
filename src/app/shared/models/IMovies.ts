import { ECaseState, EDiscCase, EDiscState, EFormat, EResolution, ETapeState, EVHSCase } from "./EItem";

export interface IMovieSearch {
    Response: boolean;
    Search: IMovieResult[];
    totalResults: string | null;
}

export interface IMovieResult {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
}

export interface IMovieDetail {
    
    imdbID: string;
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: { Source: string; Value: string }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: boolean;
}

export interface IItem {
    uid: string;
    owner: string;
    imdbID: string;
    format: EFormat;
    edition: string;
    resolution: EResolution;
    audioLanguage: string;
    subtitleLanguage: string;
    numberDiscs: number;
    caseType: EDiscCase | EVHSCase;
    stateCase: ECaseState;
    stateDisc: EDiscState;
    stateTape: ETapeState;
    storageLocation: string;
    acquisitionDate: Date;
    acquisitionPrice: number;
    supplier: string;
    isFavorite: boolean;
    watched: boolean;
    personalRating: number;
    observations: string;
}