// src/components/TopChatMenu.js
import { useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api";

export default function TopChatMenu({ className = "" }) {
  const [busy, setBusy] = useState(false);

  const user_id = localStorage.getItem("user_id") || "";
  const sessao_id = localStorage.getItem("sessao_id") || "";

  async function abrirNovaSessao() {
    if (!user_id) {
      alert("Usuário não identificado.");
      return;
    }
    try {
      setBusy(true);
      const r = await fetch(apiUrl("/nova-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, mensagem: "Nova sessão (TopChatMenu)" }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.erro || "Erro ao abrir nova sessão.");
      const novoId = j?.sessao?.id;
      if (!novoId) throw new Error("Resposta sem sessao.id");
      localStorage.setItem("sessao_id", String(novoId));
      alert("Nova sessão criada.");
    } catch (e) {
      alert(`Erro: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function encerrarSessao() {
    if (!sessao_id) {
      alert("Nenhuma sessão aberta.");
      return;
    }
    try {
      setBusy(true);
      const r = await fetch(apiUrl("/finalizar-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessao_id, user_id }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Erro ao encerrar sessão.");
      localStorage.removeItem("sessao_id");
      alert("Sessão encerrada.");
    } catch (e) {
      alert(`Erro: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`flex justify-center items-center gap-3 flex-wrap w-full ${className}`}>
      <button
        type="button"
        onClick={abrirNovaSessao}
        disabled={!user_id || busy}
        className="text-sm px-3 py-1.5 rounded bg-black text-white hover:opacity-90 disabled:opacity-60"
        title="Fecha a atual (se houver) e abre outra"
      >
        Nova sessão
      </button>

      <Link
        to="/sessoes"
        className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
        title="Veja e retome conversas anteriores"
      >
        Sessões Anteriores
      </Link>

      <Link
        to="/instrucoes"
        className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
        title="Dicas de uso e memória"
      >
        Como Usar
      </Link>

      <button
        type="button"
        onClick={encerrarSessao}
        disabled={!sessao_id || busy}
        className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
        title="Finaliza a sessão atual"
      >
        Encerrar sessão
      </button>
    </div>
  );
}

