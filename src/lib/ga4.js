// src/lib/ga4.js

// Evento genérico
export function gaEvent(name, params = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

// Clique em CTA (opcional)
// Aceita { label, place, variant } ou { label, location, variant } (retrocompat)
export function gaCtaClick(args = {}) {
  const { label, place, location: legacyLocation, variant } = args;
  const cta_location = place ?? legacyLocation ?? "(unspecified)";
  gaEvent("cta_click", {
    cta_label: label,
    cta_location,
    ...(variant ? { variant } : {})
  });
}

// Conversão de cadastro
export function gaSignUp({ method = "form" } = {}) {
  const landing =
    typeof window !== "undefined" && window.location
      ? window.location.pathname + window.location.search
      : "(unknown)";
  gaEvent("sign_up", { method, landing_page: landing });
}


