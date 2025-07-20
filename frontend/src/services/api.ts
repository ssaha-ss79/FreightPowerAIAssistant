import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAvailableLoads = async () => {
  const response = await apiClient.get('/loads?status=available');
  return response.data;
};

// Add other API functions here as needed, e.g., bookLoad, getNotifications, etc.

