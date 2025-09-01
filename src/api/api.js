import axios from 'axios';

const baseURL = 'https://projeto-coletores.onrender.com';

const api = axios.create({
  baseURL: `${baseURL}/api`,  // agora válido
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // corrigido também
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
