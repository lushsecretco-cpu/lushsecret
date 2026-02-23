// Configuración de la API
// En producción (Vercel), usa la API de Render
// En desarrollo local, usa localhost
const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
const defaultURL = isProduction ? 'https://lushsecret-api.onrender.com' : 'http://localhost:4000';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || defaultURL;
