export interface ICollectionItem {
    id: string;
    imdbID: string;
    title: string;
    year: string;
    poster: string;
    format: string;
    caseType: string;
    resolution: string;
    acquisitionDate: Date;
    acquisitionPrice: number;
    audioLanguages: string;
    subtitleLanguages: string;
    edition: string;
    isFavorite: boolean;
    numberDiscs: number;
    observations: string;
    personalRating: number;
    stateCase: string;
    stateDisc: string;
    stateTape: string;
    storageLocation: string;
    supplier: string;
    watched: boolean;
    director: string;
    
}