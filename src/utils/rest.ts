import axios from 'axios';
import { EditUserProps } from 'src/types/types';

const URL = 'https://oss-be.up.railway.app';

const formatURL = (endpoint: string, token?: string) =>
  `${URL}${endpoint}${token ? `?token=${token}` : ''}`;

export const getSpaces = (token: string) =>
  axios.get(formatURL('/spaces', token));
export const editUser = (token: string, { name, email }: EditUserProps) =>
  axios.patch(formatURL('/user', token), { name, email });
export const getLogin = (email: string, password: string) =>
  axios.post(formatURL('/login'), { email, password });
export const getRegister = (name: string, password: string, email: string) =>
  axios.post(formatURL('/register'), { name, password, email });
export const toggleFavorite = (token: string, spaceId: string) =>
  axios.patch(formatURL('/add-favorite', token), {
    spaceId,
  });
export const appendPlanningToGo = (token: string, spaceId: string) =>
  axios.patch(formatURL('/spaces', token), {
    spaceId,
  });