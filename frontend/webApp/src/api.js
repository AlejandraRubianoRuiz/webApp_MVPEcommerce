import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // tu backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Puedes agregar interceptores si usas tokens
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;