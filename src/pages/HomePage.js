// src/pages/HomePage.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

/** Modal acessível */
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

/** Barra flutuante de CTA fixa no rodapé */
function FloatingCTA() {
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
        >
          Cadastre-se grátis
        </Link>
        <Link
          to="/login"
          className="border px-5 py-2 rounded-lg"
          aria-label="Entrar"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}

/** Cartão de depoimento */
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

export default function HomePage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Ajuste os paths conforme seus arquivos no /public
  const videoSrc = "/media/alanbot-apresentacao.mp4";
  const posterSrc = "/media/alanbot-poster.jpg";

  const testimonials = [
    {
      quote:
        "Nunca imaginei que uma IA pudesse me ouvir tão bem. Me senti acolhida e até desafiada a repensar minhas escolhas.",
      author: "Juliana, 34, designer",
    },
    {
      quote:
        "O AlanBot me ajudou a organizar meus pensamentos e encontrar alternativas práticas para um problema que eu estava empacado há meses.",
      author: "Ricardo, 42, gerente de projetos",
    },
    {
      quote:
        "Gostei da sensação de conversar com alguém que lembra da minha história. Não é só bate-papo, é evolução contínua.",
      author: "Camila, 27, estudante de psicologia",
    },
  ];

  return (
    <>
      {/* padding-bottom para não ficar atrás da barra flutuante */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-14 pb-28">
        {/* HERO (sem CTAs estáticos) */}
        <section className="text-center space-y-5">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Um parceiro inteligente, sempre pronto para te ouvir
          </h1>
          <p className="text-lg text-gray-800">
            Suas conversas são 100% privadas — só entre você e o AlanBot.
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Converse sobre qualquer coisa — das suas metas aos dilemas do dia a dia. O AlanBot está aqui
            para ouvir, lembrar da sua história e te ajudar a enxergar novas possibilidades.
          </p>
        </section>

        {/* VÍDEO (thumbnail + play) */}
        <section className="space-y-3">
          <div className="relative mx-auto w-full max-w-3xl">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100"
              aria-label="Vídeo de apresentação do AlanBot"
            >
              <img
                src={posterSrc}
                alt="Apresentação do AlanBot"
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
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

        {/* COMO FUNCIONA / BENEFÍCIOS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Por que experimentar o AlanBot?</h2>
          <ul className="space-y-3 list-disc pl-6 text-gray-800">
            <li>Sempre disponível, 24h por dia.</li>
            <li>
              Lembra da sua história e conecta os pontos. Chega de ficar explicando tudo de novo a cada conversa.
            </li>
            <li>Ajuda você a resolver seus dilemas, planejar seu futuro e agir com decisão.</li>
          </ul>
          <p className="text-gray-700">
            E tudo isso com a tranquilidade de que o que você compartilha permanece confidencial.
          </p>
        </section>

        {/* CONFIDENCIALIDADE */}
        <section className="space-y-3 rounded-2xl border bg-gray-50 p-5">
          <h3 className="text-xl font-semibold">Privacidade em primeiro lugar</h3>
          <p className="text-gray-700">
            Nada do que você conversa é compartilhado, vendido ou usado fora do seu próprio atendimento no AlanBot.
            Suas conversas seguem princípios claros de confidencialidade e boas práticas de segurança.
          </p>
          <Link to="/politica" className="underline">Veja a política de privacidade completa</Link>
        </section>

        {/* QUEM É O ALAN */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Quem está por trás</h3>
          <p className="text-gray-800">
            Por trás do AlanBot está o psicoterapeuta e mentor <strong>Alan Fernandes</strong>. Há 15 anos ele
            acompanha pessoas em suas jornadas de autoconhecimento, crescimento pessoal e desenvolvimento de
            habilidades para a vida real.
          </p>
          <p className="text-gray-800">
            Agora, todo esse conhecimento foi traduzido em uma inteligência artificial que permanece fiel à essência
            do seu trabalho: ouvir sem julgamentos, provocar reflexões quando necessário e apoiar cada pessoa na
            construção de alternativas para evoluir.
          </p>
          <Link to="/about" className="underline">
          Conheça mais sobre o Alan →
          </Link>
        </section>  

        {/* PROVA SOCIAL */}
        <section className="space-y-5">
          <h3 className="text-xl font-semibold">O que dizem os primeiros usuários</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} quote={`“${t.quote}”`} author={`— ${t.author}`} />
            ))}
          </div>
        </section>

        {/* CTA FINAL (texto apenas; botões estão flutuantes) */}
        <section className="space-y-4 text-center">
          <h3 className="text-2xl font-semibold">Agora é a sua vez de experimentar</h3>
          <p className="text-gray-800">
            Converse com o AlanBot gratuitamente por 7 dias (sem cartão e sem pegadinhas).
          </p>
        </section>

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
      </main>

      {/* Barra flutuante de CTAs (esconde quando o modal está aberto) */}
      {!isVideoOpen && <FloatingCTA />}
    </>
  );
}

