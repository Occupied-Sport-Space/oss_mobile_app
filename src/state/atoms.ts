import { atom } from "recoil";
import { Space, User } from "../types/types";

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
})

export const sportSpaceState = atom<Space[] | null>({
  key: 'parkState',
  default: null,
})

export const homeNativeStackRouteState = atom<string>({
  key: 'homeNativeStackRouteState',
  default: 'MainHome'
})