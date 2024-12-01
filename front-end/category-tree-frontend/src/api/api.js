// src/api/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCategoryTree = async () => {
  const response = await apiClient.get('/categories/tree');
  console.log(response.data);
  return response.data;
};
