// src/lib/api.js

// 1) Ler variável explícita de AMBOS ecos: Vite e CRA
const viteVar =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_BASE
    : undefined;

const craVar =
  typeof process !== "undefined" && process.env
    ? process.env.REACT_APP_API_BASE
    : undefined;

// 2) Preferir a que existir (e tenha conteúdo)
const explicit = (viteVar && viteVar.trim()) || (craVar && craVar.trim());

// 3) Fallback automático por hostname
//    -> local: usa 3001 (backend local)
//    -> produção: URL pública no Render
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const inferred = isLocal
  ? "http://localhost:3001"
  : "https://mentor360-back.onrender.com"; // ajuste se sua URL do Render for outra

// 4) Base final
export const API_BASE = explicit || inferred;

console.log("[API_BASE:resolved]", API_BASE, { viteVar, craVar, inferred });

// 5) Helper para montar URLs de forma segura e padronizada
export function apiUrl(path = "") {
  if (!path) return API_BASE;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
