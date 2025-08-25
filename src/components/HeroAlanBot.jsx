import alanbot from "../assets/alanbot.png";

export default function HeroAlanBot() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl p-6 sm:p-10 mb-8">
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <img
          src={alanbot}
          alt="Avatar do AlanBot"
          width={160}
          height={160}
          className="w-32 sm:w-40 h-auto drop-shadow-md select-none"
          loading="eager"
          decoding="async"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Conheça o <span className="text-indigo-700">AlanBot</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Seu mentor virtual para conversas claras, progresso real e zero enrolação.
          </p>
          <div className="mt-4 flex gap-3 justify-center sm:justify-start">
            <a
              href="/chat"
              className="inline-flex items-center rounded-lg bg-black text-white px-4 py-2 hover:opacity-90"
            >
              Começar agora
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Saber mais
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
