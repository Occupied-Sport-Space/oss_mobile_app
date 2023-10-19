import { atom } from "recoil";
import { Park, Trick, User } from "../types/types";

// ! Remove when auth is implemented
export const userState = atom<User | null>({
  key: 'userState',
  default: null,
})

export const tricksState = atom<Trick[] | null>({
  key: 'tricksState',
  default: null,
})

export const parkState = atom<Park[] | null>({
  key: 'parkState',
  default: null,
})

export const homeNativeStackRouteState = atom<string>({
  key: 'homeNativeStackRouteState',
  default: 'MainHome'
})