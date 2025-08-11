// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
      // usa a função vinda do AppRoutes, se existir
      if (typeof onLogin === "function") {
        await onLogin(email, senha);
      }
      // sucesso: manda pra home (ou "/chat" se preferir)
      navigate("/", { replace: true });
    } catch (err) {
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
