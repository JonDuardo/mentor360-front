// LoginPage.js
import { useState } from "react";

// Base de API robusta (fallback local e saneamento)
const API = (process.env.REACT_APP_API_BASE_URL || "http://localhost:3000")
  .trim()
  .replace(/\/+$/, "");

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [aceitaPolitica, setAceitaPolitica] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!aceitaPolitica) {
      setErro("Você precisa aceitar a Política de Privacidade para continuar.");
      return;
    }

    setCarregando(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Falha no login");

      let data;
      try { data = JSON.parse(text); }
      catch { throw new Error("Resposta da API não é JSON: " + text.slice(0, 120)); }

      const user_id = data?.user?.id ?? data?.user_id ?? data?.id;
      const nome =
        data?.user?.nome ??
        data?.nome ??
        data?.user?.name ??
        data?.name ??
        "Usuário";

      if (!user_id) throw new Error("Resposta inválida do servidor (user_id).");

      onLogin({ user_id, nome });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">E-mail</span>
          <input
            type="email"
            className="mt-1 w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="voce@exemplo.com"
          />
        </label>

        <label className="block">
          <span className="text-sm">Senha</span>
          <input
            type="password"
            className="mt-1 w-full border rounded p-2"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={aceitaPolitica}
            onChange={(e) => setAceitaPolitica(e.target.checked)}
          />
          <span>
            Li e aceito a{" "}
            <a
              href="/politica"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Política de Privacidade
            </a>.
          </span>
        </label>

        {erro && <div className="text-red-600 text-sm">{erro}</div>}

        <button
          type="submit"
          disabled={carregando || !aceitaPolitica}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
