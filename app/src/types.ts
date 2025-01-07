// Type for location information (origin and current location)
interface LocationInfo {
  name: string;
  url: string;
}

// Type for a single character
export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Male" | "Female" | "Genderless" | "unknown";
  origin: LocationInfo;
  location: LocationInfo;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

// Type for the pagination information
interface PaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

// Type for the full API response
export interface RickAndMortyCharacterResponse {
  info: PaginationInfo;
  results: Character[];
}
