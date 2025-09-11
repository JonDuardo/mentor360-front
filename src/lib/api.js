// src/lib/api.js

const craUrl =
  process.env.REACT_APP_API_BASE_URL &&
  process.env.REACT_APP_API_BASE_URL.trim();
const craBase =
  process.env.REACT_APP_API_BASE &&
  process.env.REACT_APP_API_BASE.trim();
const craBackend =
  process.env.REACT_APP_BACKEND_URL &&
  process.env.REACT_APP_BACKEND_URL.trim();

const inferLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : '';

export const API_BASE = craUrl || craBase || craBackend || inferLocal;

if (typeof window !== 'undefined') {
  console.log('[API_BASE:resolved]', API_BASE, {
    craUrl,
    craBase,
    craBackend,
    inferred: inferLocal,
  });
}

export function apiUrl(path = '') {
  if (!path) return API_BASE;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

