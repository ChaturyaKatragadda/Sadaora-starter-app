// // src/services/api.js
// import axios from 'axios';

// // Get the base URL from environment variables
// // Create a .env file in your frontend directory
// // Add: VITE_API_BASE_URL=http://localhost:YOUR_BACKEND_PORT/api
// // Remember to replace YOUR_BACKEND_PORT with the actual port (e.g., 3000, 8000)
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'; // Fallback URL

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
// });

// // --- Interceptor Approach (Alternative to setting header in AuthContext) ---
// // If you prefer the interceptor approach *instead* of setting the header
// // directly in AuthContext's useEffect/login, you can do this:
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       config.headers['Authorization'] = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );
// // If using this interceptor, you can remove the direct setting of
// // api.defaults.headers.common['Authorization'] in AuthContext.jsx

// export default api;



//============================================================================
// src/services/api.js
import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,

// const api = axios.create({
//   baseURL: 'http://localhost:3001/api',
//   withCredentials: true,

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  withCredentials: false,  

});


// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       console.log("Interceptor: Adding token to request:", token); // Add log
//       config.headers['Authorization'] = `Bearer ${token}`;
//     } else {
//        console.log("Interceptor: No token found in localStorage"); // Add log
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// export default api;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
