import { EBluRayCase, ECaseState, EDiscState, EDVDCase, EFormat, EResolution, ETapeState, EVHSCase } from "./EItem";

// ==========================================================
// 🟢 NOVAS INTERFACES (API DO TMDB - The Movie Database)
// ==========================================================

export interface ITMDBMovieSearchResult {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: string;
}

export interface ITMDBMovieSearchResponse {
  page: number;
  results: ITMDBMovieSearchResult[];
  total_results: number;
  total_pages: number;
}

export interface ITMDBMovieDetail {
  id: number;
  imdb_id: string | null;
  title: string;
  original_title: string;
  original_language: string; // 🟢 Adicionado aqui!
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string; department: string }[]; // 🟢 id adicionado no crew
  };

  videos?: {
    results: { id: string; key: string; name: string; site: string; type: string }[];
  };
}

// ==========================================================
// 🟡 INTERFACES ANTIGAS (PRESERVADAS PARA NÃO QUEBRAR O APP)
// ==========================================================

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
  tmdbID?: number; // 🟢 Opcional: permite armazenar o ID numérico do TMDB no modelo antigo
}

export interface IMovieDetail {
  imdbID: string;
  tmdbID?: number; // 🟢 Opcional: para transição suave entre as APIs
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

// ==========================================================
// 🔵 ESTRUTURAS DE DOMÍNIO DO PHYSICOLL
// ==========================================================

export interface IItem {
  id: string;
  imdbID: string;
  tmdbID?: number; // 🟢 Opcional para não quebrar cadastros antigos do banco
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

export interface IMovieTrack {
  imdbID: string;
  tmdbID?: number;
  title: string;
  poster: string;
  searchCount: number;
  collectedCount: number;
  wishedCount: number;
}

export interface IMovieList {
  title: string;
  poster: string;
  addedAt: string;
  order: number;
  type: string;
  id: string;
  itemId: string;
}