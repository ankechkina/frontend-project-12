import axios from 'axios';
import { API_ROUTES } from '../utils/router';

const axiosInstance = axios.create({
  baseURL: API_ROUTES.base,
});

export const fetchChannels = async (token) => {
  try {
    const response = await axiosInstance.get('/channels', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке каналов:', error);
    throw error;
  }
};

export const fetchMessages = async (token) => {
  try {
    const response = await axiosInstance.get('/messages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке сообщений:', error);
    throw error;
  }
};

export const addMessage = async (message, token) => {
  try {
    const response = await axios.post('/api/v1/messages', message, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    throw error;
  }
};
