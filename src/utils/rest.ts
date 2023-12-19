import axios from 'axios';

const URL = 'http://localhost:8000';

const formatURL = (endpoint: string, token?: string) =>
  `${URL}${endpoint}${token ? `?token=${token}` : ''}`;

export const getSpaces = (token: string) =>
  axios.get(formatURL('/spaces', token));
export const getLoginURL = (email: string, password: string) =>
  axios.post(formatURL('/login'), { email, password });
export const getRegisterURL = (name: string, password: string, email: string) =>
  axios.post(formatURL('/register'), { name, password, email });
export const toggleFavorite = (token: string, spaceId: string) =>
  axios.patch(formatURL('/add-favorite', token), {
    spaceId,
  });