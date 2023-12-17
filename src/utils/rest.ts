import axios from 'axios';

const URL = 'http://localhost:8000';

export const getSpaces = () => axios.get(`${URL}/spaces`);
