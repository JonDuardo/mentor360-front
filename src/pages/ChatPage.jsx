// src/pages/ChatPage.js
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../lib/api";


// Fallback: cria sessão se chegarmos sem sessao_id
async function criarSessaoFallback(user_id) {
  if (!user_id) throw new Error("user_id ausente");

  const r = await fetch(apiUrl("/nova-sessao"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      mensagem: "Início da sessão (fallback ChatPage)",
    }),
  });

  const text = await r.text();
  if (!r.ok) {
    throw new Error(
      (text && text.slice(0, 160)) || `Falha ao criar sessão (HTTP ${r.status})`
    );
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Resposta não é JSON");
  }

  const novaId = data?.sessao?.id;
  if (!novaId) throw new Error("Resposta sem sessao.id");
  return String(novaId);
}

export default function ChatPage({
  user_id: userIdProp,
  user_name: userNameProp,
  sessao_id: sessaoIdProp,
}) {
  // Fonte do sessao_id: URL > prop > localStorage (inicial)
  const { sessaoId: sessaoIdFromUrl } = useParams();
  const initialSessaoId =
    sessaoIdFromUrl || sessaoIdProp || localStorage.getItem("sessao_id") || "";

  // Estado que pode mudar ao criar nova sessão
  const [sessaoId, setSessaoId] = useState(initialSessaoId);

  // Fonte do usuário: prop > localStorage
  const user_id = userIdProp || localStorage.getItem("user_id") || "";
  const user_name = userNameProp || localStorage.getItem("user_name") || "Você";

  const [mensagens, setMensagens] = useState([]); // [{origem, texto_mensagem, data_mensagem}]
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [loadingSessao, setLoadingSessao] = useState(false);
  const [erro, setErro] = useState("");
  const bottomRef = useRef(null);

  // Garante uma sessão caso a página seja aberta sem sessaoId (AppRoutes já tenta, isto é só um fallback)
  useEffect(() => {
    let cancelado = false;

    async function garantirSessao() {
      if (!user_id) return;        // sem usuário, não cria
      if (sessaoId) return;        // já existe
      try {
        setLoadingSessao(true);
        const novoId = await criarSessaoFallback(user_id);
        if (cancelado) return;
        localStorage.setItem("sessao_id", novoId);
        setSessaoId(novoId);
      } catch (e) {
        if (!cancelado) setErro(e.message);
      } finally {
        if (!cancelado) setLoadingSessao(false);
      }
    }

    garantirSessao();
    return () => {
      cancelado = true;
    };
  }, [user_id, sessaoId]);

  // Scroll automático para o fim
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // Carregar histórico ao abrir / quando mudar a sessão
  useEffect(() => {
    async function carregarHistorico() {
      setErro("");
      if (!sessaoId) return;
      try {
        const res = await fetch(
  apiUrl(`/historico/${encodeURIComponent(sessaoId)}`)
);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.error || "Falha ao carregar histórico.");
        const arr = Array.isArray(data?.mensagens) ? data.mensagens : [];
        setMensagens(arr);
      } catch (e) {
        setErro(e.message);
      }
    }
    carregarHistorico();
  }, [sessaoId]);

  async function handleEnviar(e) {
    e?.preventDefault?.();
    setErro("");

    const texto = input.trim();
    if (!texto || !user_id || !sessaoId) return;

    // Otimismo: exibe a mensagem do usuário imediatamente
    const novaMsgUsuario = {
      origem: "usuario",
      texto_mensagem: texto,
      data_mensagem: new Date().toISOString(),
      _tempId: Math.random().toString(36).slice(2),
    };
    setMensagens((prev) => [...prev, novaMsgUsuario]);
    setInput("");
    setEnviando(true);

    try {
      // 1) Salvar a mensagem no histórico
      const resSave = await fetch(apiUrl("/mensagem"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessao_id: sessaoId,
          user_id,
          texto_mensagem: texto,
          origem: "usuario",
        }),
      });
      const dataSave = await resSave.json();
      if (!resSave.ok)
        throw new Error(
          dataSave?.error || "Não foi possível salvar a mensagem."
        );

      // 2) Pedir resposta da IA
     const resIa = await fetch(apiUrl("/ia?debug=1"), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id,
    sessao_id: sessaoId,
    mensagem: texto
  }),
});
      const dataIa = await resIa.json();
      if (!resIa.ok)
        throw new Error(dataIa?.erro || "Falha ao obter resposta da IA.");

      const respostaBot = (dataIa?.resposta || "").trim();
      if (respostaBot) {
        setMensagens((prev) => [
          ...prev,
          {
            origem: "bot",
            texto_mensagem: respostaBot,
            data_mensagem: new Date().toISOString(),
          },
        ]);
      }
    } catch (e) {
      // Em caso de erro, mostra uma “bolha” de erro do sistema
      setMensagens((prev) => [
        ...prev,
        {
          origem: "sistema",
          texto_mensagem: `Erro: ${e.message}`,
          data_mensagem: new Date().toISOString(),
        },
      ]);
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  // Encerrar sessão atual
  async function encerrarSessao() {
    if (!sessaoId) {
      alert("Nenhuma sessão aberta.");
      return;
    }
    try {
      setLoadingSessao(true);
     const r = await fetch(apiUrl("/finalizar-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessao_id: sessaoId }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Erro ao encerrar sessão.");

      // limpar local e UI
      localStorage.removeItem("sessao_id");
      setSessaoId("");
      setMensagens((prev) => [
        ...prev,
        {
          origem: "sistema",
          texto_mensagem: "Sessão encerrada.",
          data_mensagem: new Date().toISOString(),
        },
      ]);
      alert("Sessão encerrada com sucesso.");
    } catch (e) {
      alert(`Erro: ${e.message}`);
    } finally {
      setLoadingSessao(false);
    }
  }

  // Abrir nova sessão (encerra a anterior automaticamente no backend)
  async function abrirNovaSessao() {
    if (!user_id) return alert("Usuário não identificado.");
    try {
      setLoadingSessao(true);
      const r = await fetch(apiUrl("/nova-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, mensagem: "Nova sessão" }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.erro || "Erro ao abrir nova sessão.");

      const novoId = j?.sessao?.id;
      if (novoId) {
        localStorage.setItem("sessao_id", String(novoId));
        setSessaoId(String(novoId));
        setMensagens([]); // limpa histórico da tela
        alert("Nova sessão aberta.");
      } else {
        throw new Error("Resposta sem sessao.id");
      }
    } catch (e) {
      alert(`Erro: ${e.message}`);
    } finally {
      setLoadingSessao(false);
    }
  }

  // UI
  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-4rem)] flex flex-col p-4">
      <header className="pb-3 border-b">
        <h1 className="text-xl font-semibold">Mentor Tríade — Chat</h1>
        <div className="text-sm text-gray-500 flex items-center gap-3 flex-wrap">
          <span>
            Usuário: <b>{user_name}</b> • Sessão: <code>{sessaoId || "-"}</code>
          </span>
          <div className="ml-auto flex items-center gap-8">
            <button
              type="button"
              onClick={encerrarSessao}
              disabled={!sessaoId || loadingSessao}
              className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
              title="Finaliza a sessão atual"
            >
              Encerrar sessão
            </button>
            <button
              type="button"
              onClick={abrirNovaSessao}
              disabled={!user_id || loadingSessao}
              className="text-sm px-3 py-1.5 rounded bg-black text-white hover:opacity-90 disabled:opacity-60"
              title="Fecha a atual (se houver) e abre outra"
            >
              Nova sessão
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {mensagens.map((m, idx) => {
          const isUser = m.origem === "usuario";
          const isBot = m.origem === "bot";
          const align = isUser ? "items-end" : "items-start";
          const bubble = isUser
            ? "bg-blue-600 text-white"
            : isBot
            ? "bg-gray-100 text-gray-900"
            : "bg-yellow-100 text-yellow-900";

        return (
            <div key={idx} className={`flex ${align}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${bubble} whitespace-pre-wrap`}>
                {m.texto_mensagem}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleEnviar} className="pt-3 border-t flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder={loadingSessao ? "Criando sessão..." : "Escreva sua mensagem…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!sessaoId || !user_id || enviando || loadingSessao}
        />
        <button
          type="submit"
          disabled={!input.trim() || enviando || !sessaoId || loadingSessao}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {erro && <div className="text-red-600 text-sm mt-2">Erro: {erro}</div>}
    </div>
  );
}
