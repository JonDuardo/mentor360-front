// src/pages/CadastroPage.jsx
import { useState } from "react";
import { API_BASE_URL } from "../config"; // usa a URL central

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneEmergencia, setTelefoneEmergencia] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);
    try {
      const res = await fetch(`${API_BASE_URL}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          telefone_emergencia: telefoneEmergencia,
          senha,
        }),
      });

      // tenta ler JSON, senão lê texto para mensagem de erro
      let data;
      try {
        const ct = res.headers.get("content-type") || "";
        data = ct.includes("application/json") ? await res.json() : await res.text();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg = typeof data === "string" ? data : data?.erro || "Falha no cadastro";
        throw new Error(msg);
      }

      setMensagem("Cadastro realizado com sucesso! Você já pode fazer login.");
      setNome(""); setEmail(""); setTelefone(""); setTelefoneEmergencia(""); setSenha("");
    } catch (err) {
      setMensagem(
        err.message === "Failed to fetch"
          ? "Não foi possível conectar. Tente novamente em alguns segundos."
          : err.message
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Cadastro</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Nome</span>
          <input
            type="text"
            className="mt-1 w-full border rounded p-2"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>

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
          <span className="text-sm">Telefone</span>
          <input
            type="tel"
            className="mt-1 w-full border rounded p-2"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm">Telefone de Emergência</span>
          <input
            type="tel"
            className="mt-1 w-full border rounded p-2"
            value={telefoneEmergencia}
            onChange={(e) => setTelefoneEmergencia(e.target.value)}
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

        {mensagem && (
          <div className={`text-sm ${mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
            {mensagem}
          </div>
        )}

        <button type="submit" disabled={carregando} className="w-full bg-black text-white py-2 rounded">
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

