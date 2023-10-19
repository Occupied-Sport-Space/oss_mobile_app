import AsyncStorage from "@react-native-async-storage/async-storage";

export enum StorageKeys {
  USER = 'USER',
}

export const getItem = async (itemKey: StorageKeys) => {
  return AsyncStorage.getItem(itemKey).then((value) => value ? JSON.parse(value) : null)
}

export const setItem = (itemKey: StorageKeys, data: string) => {
  AsyncStorage.setItem(itemKey, data)
}