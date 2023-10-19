
export interface Trick {
  id: number
  name: string
  image: string
  skillLevel: number
  description: string
}

export interface Park {
  id: number
  coords: {
    latitude: number,
    longitude: number
  }
  name: string
  link: string
  price: { total: number, duration: string }
  logo: string
  markerLogo: string;
  availability: number;
  estimateWait: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}