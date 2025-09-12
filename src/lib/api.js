// src/lib/api.js

// Base URL da API resolvida a partir de variáveis de ambiente ou host local
export const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  ((typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"))
    ? "http://localhost:3001"
    : "");

// Helper para construir URLs garantindo uma barra entre base e caminho
export function apiUrl(path = "") {
  if (!path) return API_BASE;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

if (typeof window !== "undefined") {
  console.log("[API_BASE:resolved]", API_BASE, {
    craVar:
      process.env.REACT_APP_API_BASE_URL ||
      process.env.REACT_APP_BACKEND_URL,
    inferred: API_BASE,
  });
}

