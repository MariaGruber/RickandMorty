export interface InfoAPI {
    info: Info;
    results: Episode[];
  }
  
export interface Info {
    count: number;
    pages: number;
    next: string;
    prev: null;
  }
  
export interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
    url: string;
    created: string;
  }

  //Characters
export interface Character {
    name: string;
    status: CharacterStatus;
    species: string;
    gender: CharacterGender;
    image: string;
}

enum CharacterStatus {
    Alive = "Alive",
    Dead = "Dead",
    Unknow = "Unknown",
}

enum CharacterGender {
    Male = "Male",
    Female = "Female",
    Unknown = "Unknown",
}