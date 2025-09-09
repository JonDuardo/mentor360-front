// src/pages/SessoesPage.js
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopChatMenu from "../components/TopChatMenu";
import { apiUrl } from "../lib/api";

export default function SessoesPage() {
  const [sessoes, setSessoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

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
        const res = await fetch(apiUrl(`/sessoes/${user_id}`));
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

        {/* Barra de ações */}
        <div className="mb-6">
          <TopChatMenu />
        </div>

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

      {/* Barra de ações */}
      <div className="mb-6">
        <TopChatMenu />
      </div>

      <ul className="space-y-3">
        {sessoes.map((s) => {
          const data = s.data_sessao ? new Date(s.data_sessao) : null;
          const dataFmt = data ? data.toLocaleString() : "-";
          const resumo = s.resumo || "— sem resumo —";
          const tagsTema = Array.isArray(s.tags_tema)
            ? s.tags_tema.join(", ")
            : s.tags_tema || "";
          const tagsRisco = Array.isArray(s.tags_risco)
            ? s.tags_risco.join(", ")
            : s.tags_risco || "";
          return (
            <li key={s.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">{dataFmt}</div>
                  <div className="font-medium mt-1">{resumo}</div>
                  {tagsTema && (
                    <div className="text-xs mt-1 text-gray-600">
                      Temas: {tagsTema}
                    </div>
                  )}
                  {tagsRisco && (
                    <div className="text-xs mt-1 text-red-600">
                      Riscos: {tagsRisco}
                    </div>
                  )}
                  {s.status && (
                    <div className="text-xs mt-1">
                      Status: <span className="font-medium">{s.status}</span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => navigate(`/chat/${s.id}`)}
                    className="px-3 py-2 rounded bg-black text-white"
                  >
                    Retomar
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

