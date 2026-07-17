let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (apiUrl && !apiUrl.endsWith('/api') && !apiUrl.includes('/api/')) {
  apiUrl = `${apiUrl.replace(/\/$/, '')}/api`;
}
export const API_URL = apiUrl;
