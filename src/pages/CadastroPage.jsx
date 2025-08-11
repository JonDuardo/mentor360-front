// CadastroPage.js
import { useState } from "react";
import { API_BASE_URL } from "../config";


const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://mentor360-back.onrender.com";

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
      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || "Falha no cadastro");
      setMensagem("Cadastro realizado com sucesso! Você já pode fazer login.");
      // limpa o formulário
      setNome("");
      setEmail("");
      setTelefone("");
      setTelefoneEmergencia("");
      setSenha("");
    } catch (err) {
      setMensagem(err.message);
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
          <div
            className={`text-sm ${
              mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensagem}
          </div>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-black text-white py-2 rounded"
        >
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}