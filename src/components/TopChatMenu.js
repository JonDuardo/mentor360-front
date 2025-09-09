// src/components/TopChatMenu.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";

export default function TopChatMenu({
  className = "",
  onNovaSessao,        // se vier do ChatPage, usamos
  onEncerrarSessao,    // se vier do ChatPage, usamos
  disabled = false,
}) {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id") || "";
  const sessao_id = localStorage.getItem("sessao_id") || "";

  async function fallbackAbrirNovaSessao() {
    if (!user_id) return alert("Usuário não identificado.");
    try {
      setBusy(true);
      const r = await fetch(apiUrl("/nova-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, mensagem: "Nova sessão (TopChatMenu fallback)" }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.erro || "Erro ao abrir nova sessão.");
      const novoId = j?.sessao?.id;
      if (!novoId) throw new Error("Resposta sem sessao.id");
      localStorage.setItem("sessao_id", String(novoId));
      navigate(`/chat/${novoId}`);
    } catch (e) {
      alert(`Erro: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function fallbackEncerrarSessao() {
    if (!sessao_id) return alert("Nenhuma sessão aberta.");
    try {
      setBusy(true);
      const r = await fetch(apiUrl("/finalizar-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessao_id, user_id }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Erro ao encerrar sessão.");

      // abre nova imediatamente e navega
      const rNova = await fetch(apiUrl("/nova-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, mensagem: "Nova sessão (após encerrar via TopChatMenu)" }),
      });
      const jNova = await rNova.json();
      if (!rNova.ok) throw new Error(jNova?.erro || "Erro ao abrir nova sessão.");
      const novoId = jNova?.sessao?.id;
      if (!novoId) throw new Error("Resposta sem sessao.id");

      localStorage.setItem("sessao_id", String(novoId));
      navigate(`/chat/${novoId}`);
    } catch (e) {
      alert(`Erro: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  const handleNovaSessao =
    onNovaSessao || fallbackAbrirNovaSessao;

  const handleEncerrarSessao =
    onEncerrarSessao || fallbackEncerrarSessao;

  const isDisabled = disabled || busy;

  return (
    <div className={`flex justify-center items-center gap-3 flex-wrap w-full ${className}`}>
      <button
        type="button"
        onClick={handleNovaSessao}
        disabled={!user_id || isDisabled}
        className="text-sm px-3 py-1.5 rounded bg-black text-white hover:opacity-90 disabled:opacity-60"
        title="Fecha a atual (se houver) e abre outra"
      >
        Nova sessão
      </button>

      <button
        type="button"
        onClick={() => navigate("/sessoes")}
        className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
        title="Veja e retome conversas anteriores"
      >
        Sessões Anteriores
      </button>

      <button
        type="button"
        onClick={() => navigate("/instrucoes")}
        className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
        title="Dicas de uso e memória"
      >
        Como Usar
      </button>

      <button
        type="button"
        onClick={handleEncerrarSessao}
        disabled={!sessao_id || isDisabled}
        className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
        title="Finaliza a sessão atual"
      >
        Encerrar sessão
      </button>
    </div>
  );
}

