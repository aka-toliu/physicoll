import { EBluRayCase, ECaseState, EDiscState, EDVDCase, EFormat, EResolution, ETapeState, EVHSCase } from "./EItem";

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
    id: string;
    imdbID: string;
    genre: string[];
    director: string[];
    actors: string[];
    writer: string[];
    country: string[];
    originalLanguage: string[];
    format: EFormat;
    hasMoreThanOneDisc: boolean;
    numberDiscs: number;
    caseType: EDVDCase | EBluRayCase | EVHSCase;
    stateCase: ECaseState;
    stateDisc: EDiscState;
    stateTape: ETapeState;
    storageLocation: string;
    acquisitionDate: Date;
    acquisitionPrice: number;
    supplier: string;
    aviableToExchange: boolean;
    avaliableToSell: boolean;
    isLoaned: boolean;
    isSpecialEdition: boolean;
    edition: string;
    resolution: EResolution;
    audioLanguage: string[];
    subtitleLanguage: string[];
    isFavorite: boolean;
    watched: boolean;
    lastWatchedDate: Date | null;
    personalRating: number;
    observations: string;
    addedAt: Date;
}

export interface IMovieTrack{
    imdbID: string;
    title: string;
    poster: string;
    searchCount: number;
    collectedCount: number;
    wishedCount: number;
}

export interface IMovieList{
    title: string;
    poster: string;
    addedAt: string;
    order: number;
    type: string;
    id: string;
    itemId: string;
}