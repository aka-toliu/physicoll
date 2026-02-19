export interface IMovieSearch {
    Response: boolean;
    Search: IMovie[];
    totalResults: string;
}

export interface IMovie {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
}