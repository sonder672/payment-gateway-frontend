import axios from 'axios';
import AuthService from './AuthService';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL + '/api/v1';

axios.interceptors.request.use(
  (config) => {
    const token = AuthService.getAuthToken();
    if (token && config.headers['AuthorizationEnabled']) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default {
  async get(url, enableAuthorization = true) {
    try {
      const response = await axios.get(`${API_BASE_URL}${url}`, {
        headers: {
          AuthorizationEnabled: enableAuthorization,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error en la solicitud GET:', error);
      throw error;
    }
  },

  async post(url, enableAuthorization = true, data, contentType = 'application/json') {
    try {
      const response = await axios.post(`${API_BASE_URL}${url}`, data, {
        headers: {
          AuthorizationEnabled: enableAuthorization,
          'Content-Type': contentType,
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
