// SessoesPage.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://mentor360-back.onrender.com";

export default function SessoesPage() {
  const [sessoes, setSessoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Busca user_id do localStorage
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const carregar = async () => {
      if (!user_id) {
        setErro("Usuário não autenticado.");
        setCarregando(false);
        return;
      }
      try {
        setCarregando(true);
        const res = await fetch(`${API_BASE_URL}/sessoes/${user_id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.erro || "Falha ao buscar sessões.");
        if (Array.isArray(data?.sessoes)) {
          setSessoes(data.sessoes);
        } else {
          throw new Error("Resposta inesperada do servidor.");
        }
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [user_id]);

  if (carregando) return <div className="p-6">Carregando sessões…</div>;
  if (erro) return <div className="p-6 text-red-600">Erro: {erro}</div>;

  if (!sessoes.length) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Suas sessões</h2>
        <p>Você ainda não tem sessões registradas.</p>
        <Link to="/chat" className="inline-block mt-4 underline text-blue-600">
          Iniciar uma nova sessão
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Suas sessões</h2>
      <ul className="space-y-3">
        {sessoes.map((s) => {
          const data = s.criado_em ? new Date(s.criado_em) : null;
          const dataFmt = data ? data.toLocaleString() : "-";
          const resumo = s.resumo || "— sem resumo —";
          const tags = Array.isArray(s.tags) ? s.tags.join(", ") : (s.tags || "");
          return (
            <li key={s.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">{dataFmt}</div>
                  <div className="font-medium mt-1">{resumo}</div>
                  {tags && (
                    <div className="text-xs mt-1 text-gray-600">Tags: {tags}</div>
                  )}
                  {s.status && (
                    <div className="text-xs mt-1">
                      Status: <span className="font-medium">{s.status}</span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <Link
                    to={`/chat/${s.id}`}
                    className="px-3 py-2 rounded bg-black text-white"
                  >
                    Retomar
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
