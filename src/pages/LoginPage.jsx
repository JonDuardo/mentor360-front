// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../lib/api";

function pickUserId(d) {
  const cands = [
    d?.user?.id,
    d?.user_id,
    d?.id,
    d?.usuario?.id,
    d?.data?.user?.id,
    d?.data?.id,
    d?.perfil?.id,
    d?.result?.user?.id,
    d?.result?.id,
  ];
  return cands.find((v) => v !== undefined && v !== null && String(v) !== "");
}

function pickUserName(d, fallbackEmail) {
  const cands = [
    d?.user?.name,
    d?.user?.nome,
    d?.name,
    d?.nome,
    d?.usuario?.nome,
    d?.perfil?.nome,
  ];
  const nome = cands.find((v) => v && String(v).trim() !== "");
  if (nome) return String(nome);
  if (fallbackEmail && fallbackEmail.includes("@"))
    return fallbackEmail.split("@")[0];
  return "Usuário";
}

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        /* ignore parse error */
      }

      if (!res.ok) {
        const m =
          data?.error ||
          data?.message ||
          `Falha no login (HTTP ${res.status})`;
        throw new Error(m);
      }

      console.log("[LOGIN_DATA]", data);

      const userId = pickUserId(data);
      if (!userId) throw new Error("Resposta do login sem user_id");

      const nome = pickUserName(data, email);
      console.log("[USER_RESOLVED]", { userId, nome });

      // Persiste no localStorage
      localStorage.setItem("user_id", String(userId));
      localStorage.setItem("user_name", String(nome));
      if (data?.token) localStorage.setItem("token", data.token);

      // Notifica a app (tolerante ao formato)
      if (typeof onLogin === "function") {
        onLogin({ user_id: String(userId), nome, raw: data });
      }

      // Navega após salvar
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Falha no login:", err);
      setMsg(err?.message || "Falha no login");
    } finally {
      setLoading(false);
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
            autoFocus
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
          />
        </label>

        {msg && <div className="text-sm text-red-600">{msg}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-4 text-sm">
        <span className="text-gray-600">Ainda não tem conta? </span>
        <Link to="/cadastro" className="underline">
          Cadastre-se
        </Link>
      </div>
    </div>
  );
}
