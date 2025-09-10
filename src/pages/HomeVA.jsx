// src/pages/HomeVA.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

/** Util: GA4 opcional (só funciona depois que você instalar o GA) */
function gaPageView({ path, title, variant }) {
  if (!window.gtag) return;
  window.gtag("event", "page_view", {
    page_title: title,
    page_location: window.location.href,
    page_path: path,
    variant,
  });
}
function gaCtaClick({ label, location, variant }) {
  if (!window.gtag) return;
  window.gtag("event", "cta_click", { cta_label: label, cta_location: location, variant });
}

/** Modal acessível (copiado/independente) */
function Modal({ open, onClose, children, title = "Vídeo de apresentação" }) {
  const dialogRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) {
      lastFocused.current = document.activeElement;
      document.addEventListener("keydown", onKey);
      setTimeout(() => dialogRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocused.current && lastFocused.current.focus?.();
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-3xl outline-none">
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 rounded-full p-2 bg-white/90 hover:bg-white shadow"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Barra flutuante de CTA (copiada/independente) */
function FloatingCTA({ onPrimary, onSecondary }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+12px)]"
      aria-label="Ações"
    >
      <div className="pointer-events-auto mx-4 mb-3 inline-flex items-center gap-3 rounded-2xl border bg-white/90 backdrop-blur px-3 py-2 shadow-xl">
        <Link
          to="/cadastro"
          className="bg-black text-white px-5 py-2 rounded-lg"
          aria-label="Cadastre-se grátis"
          onClick={onPrimary}
        >
          Cadastre-se grátis
        </Link>
        <Link
          to="/login"
          className="border px-5 py-2 rounded-lg"
          aria-label="Entrar"
          onClick={onSecondary}
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}

/** Cartão de depoimento (copiado/independente) */
function TestimonialCard({ quote, author }) {
  return (
    <figure className="rounded-2xl border bg-white p-5 shadow-sm">
      <svg className="h-6 w-6 mb-3 opacity-70" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V22h8v-8H6.83A2.83 2.83 0 0 1 4 11.17C4 9.41 5.41 8 7.17 8V6Zm9 0A5.17 5.17 0 0 0 11 11.17V22h8v-8h-3.17A2.83 2.83 0 0 1 13 11.17C13 9.41 14.41 8 16.17 8V6Z" />
      </svg>
      <blockquote className="text-gray-800">{quote}</blockquote>
      <figcaption className="mt-3 text-sm text-gray-600">{author}</figcaption>
    </figure>
  );
}

export default function HomeVA() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Meta tags específicas desta variante (noindex + canonical)
  useEffect(() => {
    document.title = "AlanBot — Versão Alternativa";
    // noindex
    const metaNoIndex = document.createElement("meta");
    metaNoIndex.name = "robots";
    metaNoIndex.content = "noindex";
    document.head.appendChild(metaNoIndex);
    // canonical
    const linkCanonical = document.createElement("link");
    linkCanonical.rel = "canonical";
    linkCanonical.href = `${window.location.origin}/`;
    document.head.appendChild(linkCanonical);

    // GA4 page_view (opcional; só funciona depois de você instalar o GA)
    gaPageView({ path: "/va", title: "Home (VA)", variant: "VA" });

    return () => {
      // limpeza das tags quando sair da rota
      document.head.removeChild(metaNoIndex);
      document.head.removeChild(linkCanonical);
    };
  }, []);

  const onPrimary = () => gaCtaClick({ label: "cadastre-se-gratis", location: "floating", variant: "VA" });
  const onSecondary = () => gaCtaClick({ label: "entrar", location: "floating", variant: "VA" });

  const videoSrc = "/media/alanbot-apresentacao.mp4";
  const posterSrc = "/media/alanbot-poster.jpg";

  const testimonials = [
    { quote: "“Nunca imaginei que uma IA pudesse me ouvir tão bem. Me senti acolhida e até desafiada a repensar minhas escolhas.”", author: "— Juliana, 34, designer" },
    { quote: "“Organizei meus pensamentos e destravei um problema que me travava há meses.”", author: "— Ricardo, 42, gerente de projetos" },
    { quote: "“Não é só bate-papo: ele lembra da minha história e me ajuda a evoluir de verdade.”", author: "— Camila, 27, estudante de psicologia" },
  ];

  return (
    <>
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-14 pb-28">
        {/* HEADLINE (Atenção) */}
        <section className="text-center space-y-5">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Liberte sua mente das dúvidas e inseguranças.
          </h1>
          <p className="text-lg text-gray-900 font-semibold">
            Converse agora com a IA que ajuda você a ganhar clareza, confiança e consistência na vida
            <span className="font-normal"> (100% gratuita na versão beta)</span>.
          </p>
        </section>

        {/* SUBHEAD (Interesse) */}
        <section className="space-y-3 text-center max-w-3xl mx-auto">
          <p className="text-gray-800">
            Não é só mais um chat genérico de IA. O AlanBot foi criado por um psicoterapeuta e mentor com 15 anos de experiência
            para ser seu mentor digital — alguém que te ouve, lembra da sua história e guia você em direção à sua melhor versão.
          </p>
          <p>
            <Link to="/about" className="underline font-medium">Conheça o Alan Fernandes, idealizador do AlanBot</Link>.
          </p>
        </section>

        {/* VÍDEO */}
        <section className="space-y-3">
          <div className="relative mx-auto w-full max-w-3xl">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100" aria-label="Vídeo de apresentação do AlanBot">
              <img
                src={posterSrc}
                alt="Apresentação do AlanBot"
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <button
                className="absolute inset-0 flex items-center justify-center"
                onClick={() => setIsVideoOpen(true)}
                aria-label="Assistir vídeo de apresentação"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-5 py-3 shadow hover:bg-white">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Assistir
                </span>
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            “É como conversar com alguém que realmente me entende.” — Luciana, engenheira, 32
          </p>
        </section>

        {/* BENEFÍCIOS (Desejo) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">O que você ganha na prática</h2>
          <ul className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-800">
            <li>✅ <span className="font-medium">Mais clareza mental:</span> organize seus pensamentos e descubra caminhos para seus dilemas.</li>
            <li>✅ <span className="font-medium">Liberdade emocional:</span> identifique padrões que travam seus resultados e sua qualidade de vida.</li>
            <li>✅ <span className="font-medium">Confiança nas conversas:</span> melhore sua comunicação e influência no dia a dia.</li>
            <li>✅ <span className="font-medium">Consistência nos objetivos:</span> crie planos práticos e conte com cobrança sem julgamentos.</li>
            <li>✅ <span className="font-medium">Habilidades sociais e emocionais:</span> avance em direção à sua melhor versão.</li>
            <li>✅ <span className="font-medium">Privacidade garantida:</span> tudo fica entre você e o AlanBot.</li>
          </ul>
        </section>

        {/* OFERTA + ESCASSEZ (Ação) */}
        <section className="space-y-3 text-center">
          <div className="inline-block rounded-2xl border bg-gray-50 px-6 py-5">
            <p className="text-gray-800">
              Estamos liberando um <span className="font-semibold">número limitado de acessos gratuitos</span> para a versão beta.
            </p>
            <p className="text-gray-800">
              Converse com o AlanBot sem pagar nada, por tempo ilimitado — antes que o acesso seja fechado e vire pago.
            </p>
          </div>
          <div>
            <Link to="/cadastro" className="inline-block mt-2 bg-black text-white px-6 py-3 rounded-lg">
              Quero meu acesso gratuito agora
            </Link>
          </div>
        </section>

        {/* PROVA SOCIAL */}
        <section className="space-y-5">
          <h3 className="text-xl font-semibold text-center">💬 O que os primeiros usuários estão dizendo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} quote={t.quote} author={t.author} />
            ))}
          </div>
        </section>

        {/* REFORÇO FINAL */}
        <section className="space-y-3 text-center">
          <p className="text-gray-700">
            Você não precisa de cartão. Não tem pegadinha. É só se inscrever, conversar e sentir na prática.
          </p>
          <div>
            <Link to="/cadastro" className="inline-block bg-black text-white px-6 py-3 rounded-lg">
              Quero meu acesso gratuito agora
            </Link>
          </div>
        </section>
      </main>

      {/* MODAL DO VÍDEO */}
      <Modal open={isVideoOpen} onClose={() => setIsVideoOpen(false)}>
        <div className="aspect-video w-full bg-black">
          <video
            src={videoSrc}
            poster={posterSrc}
            className="h-full w-full"
            controls
            autoPlay
            preload="metadata"
          />
        </div>
      </Modal>

      {/* CTA flutuante */}
      {!isVideoOpen && <FloatingCTA onPrimary={onPrimary} onSecondary={onSecondary} />}
    </>
  );
}
