// src/lib/api.js

// Resolve a URL base da API priorizando variáveis de ambiente do CRA,
// com fallbacks locais simples para desenvolvimento.
const craUrl =
  process.env.REACT_APP_API_BASE_URL &&
  process.env.REACT_APP_API_BASE_URL.trim();
const craBase =
  process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim();
const craBackend =
  process.env.REACT_APP_BACKEND_URL &&
  process.env.REACT_APP_BACKEND_URL.trim();

const inferLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:3001"
    : null;

// Se precisar de fallback web, use o mesmo host do front (origem) com heurística simples,
// ou mantenha null para não viciar em domínio de produção errado.
const inferWeb = null;

export const API_BASE =
  craUrl || craBase || craBackend || inferLocal || inferWeb;

if (typeof window !== "undefined") {
  // Log curto para validação no Console
  console.log("[API_BASE:resolved]", API_BASE, { craUrl, craBase, craBackend });
}

// Helper para montar URLs de forma segura e padronizada
export function apiUrl(path = "") {
  const base = API_BASE || "";
  if (!path) return base;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
