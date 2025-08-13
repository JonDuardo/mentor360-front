// src/lib/api.js
export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" &&
   window.location.hostname.endsWith("onrender.com")
     ? "https://mentor360-back.onrender.com"
     : "http://localhost:3000");

console.log("[API_BASE]", API_BASE);
