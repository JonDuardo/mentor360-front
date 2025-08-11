// CadastroPessoasPage.js
import { useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://mentor360-back.onrender.com";

export default function CadastroPessoasPage() {
  const [pessoas, setPessoas] = useState([
    { nome: "", apelido: "", relacao: "", sentimento: "" },
  ]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  function handleChange(index, campo, valor) {
    const novasPessoas = [...pessoas];
    novasPessoas[index][campo] = valor;
    setPessoas(novasPessoas);
  }

  function adicionarPessoa() {
    setPessoas([
      ...pessoas,
      { nome: "", apelido: "", relacao: "", sentimento: "" },
    ]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) throw new Error("Usuário não autenticado.");

      const res = await fetch(`${API_BASE_URL}/pessoas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, pessoas }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || "Falha ao cadastrar pessoas.");

      setMensagem("Pessoas cadastradas com sucesso!");
      setPessoas([{ nome: "", apelido: "", relacao: "", sentimento: "" }]);
    } catch (err) {
      setMensagem(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Cadastro de Pessoas Importantes</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {pessoas.map((p, idx) => (
          <div key={idx} className="space-y-2 border-b pb-4">
            <input
              type="text"
              placeholder="Nome"
              value={p.nome}
              onChange={(e) => handleChange(idx, "nome", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Apelido"
              value={p.apelido}
              onChange={(e) => handleChange(idx, "apelido", e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Relação"
              value={p.relacao}
              onChange={(e) => handleChange(idx, "relacao", e.target.value)}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="Sentimento"
              value={p.sentimento}
              onChange={(e) => handleChange(idx, "sentimento", e.target.value)}
              className="w-full border p-2 rounded"
              rows={2}
            ></textarea>
          </div>
        ))}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={adicionarPessoa}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Adicionar mais
          </button>
          <button
            type="submit"
            disabled={carregando}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {carregando ? "Salvando..." : "Finalizar cadastro"}
          </button>
        </div>

        {mensagem && (
          <div
            className={`text-sm ${
              mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensagem}
          </div>
        )}
      </form>
    </div>
  );
}

