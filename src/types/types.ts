
export interface Trick {
  id: number
  name: string
  image: string
  skillLevel: number
  description: string
}

export enum DurationEnum {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  DAY = 'DAY'
}

export interface Price {
  price: number;
  duration: DurationEnum;
}

export interface Space {
  id: string
  coords: {
    latitude: number,
    longitude: number
  }
  name: string
  link: string
  price: Price[] | Price;
  logo: string
  markerLogo: string;
  availability: number;
  maxAvailable: number;
  estimateWait: string;
  address: string;
}

export interface User {
  id: string;
  username: string;
  favorites: string[];
  email: string;
  token: string;
}