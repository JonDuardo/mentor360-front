// src/pages/ChatPage.js
import { useEffect, useRef, useState } from "react";
import { apiUrl } from "../lib/api";
import FeedbackModal from "../components/FeedbackModal";
import { useParams, useNavigate } from "react-router-dom";
import TopChatMenu from "../components/TopChatMenu";

// Detecta ambiente para a regra de frequência do feedback
const PROD_HOSTS = ["mentor360-front.onrender.com"];
function detectarAmbiente() {
  const env = (process.env.REACT_APP_AMBIENTE || process.env.NODE_ENV || "").toLowerCase();
  if (env.includes("prod")) return "prod";
  if (typeof window !== "undefined" && PROD_HOSTS.includes(window.location.hostname)) return "prod";
  return "beta";
}

// Fallback: cria sessão se chegarmos sem sessao_id
async function criarSessaoFallback(user_id) {
  if (!user_id) throw new Error("user_id ausente");

  const r = await fetch(apiUrl("/nova-sessao"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      user_id,
      mensagem: "Início da sessão (fallback ChatPage)",
    }),
  });

  const text = await r.text();
  if (!r.ok) {
    throw new Error((text && text.slice(0, 160)) || `Falha ao criar sessão (HTTP ${r.status})`);
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

// Conta quantas sessões encerradas o usuário tem (para a regra de frequência)
async function contarSessoesEncerradas(user_id) {
  const res = await fetch(apiUrl(`/sessoes/${encodeURIComponent(user_id)}`), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.erro || data?.error || "Falha ao carregar sessões.");
  const arr = Array.isArray(data?.sessoes) ? data.sessoes : [];
  return arr.filter((s) => String(s.status || "").toLowerCase() === "encerrada").length;
}

function deveAbrirFeedback(totalEncerradas, ambiente) {
  if (totalEncerradas <= 0) return false;
  if (totalEncerradas === 1) return true; // sempre mostrar na 1ª
  const limite = ambiente === "prod" ? 10 : 3;
  return totalEncerradas % limite === 0;
}

export default function ChatPage({
  user_id: userIdProp,
  user_name: userNameProp,
  sessao_id: sessaoIdProp,
}) {
  const navigate = useNavigate();

  // Fonte do sessao_id: URL > prop > localStorage (inicial)
  const { sessaoId: sessaoIdFromUrl } = useParams();
  const initialSessaoId =
    sessaoIdFromUrl || sessaoIdProp || localStorage.getItem("sessao_id") || "";

  // Estado que pode mudar ao criar nova sessão
  const [sessaoId, setSessaoId] = useState(initialSessaoId);
  const sessaoIdRef = useRef(sessaoId);

  // se true: sessão pode ser lida, mas não envia mensagens
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    sessaoIdRef.current = sessaoId;
  }, [sessaoId]);

  // Fonte do usuário: prop > localStorage
  const user_id = userIdProp || localStorage.getItem("user_id") || "";
  const user_name = userNameProp || localStorage.getItem("user_name") || "Você";

  const [mensagens, setMensagens] = useState([]); // [{origem, texto_mensagem, data_mensagem}]
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [loadingSessao, setLoadingSessao] = useState(false);
  const [transitioning, setTransitioning] = useState(false); // bloqueia UI durante troca de sessão
  const [erro, setErro] = useState("");
  const bottomRef = useRef(null);

  // Feedback modal
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSessaoId, setFeedbackSessaoId] = useState(""); // ID da sessão recém-encerrada
  const ambiente = detectarAmbiente();

  // refs para abortar requisições em voo
  const histAbortRef = useRef(null);
  const iaAbortRef = useRef(null);

  // ref para o textarea auto-expansível
  const textareaRef = useRef(null);
  const MAX_ROWS = 8;
  const LINE_HEIGHT = 24; // px, alinhado com leading-6

  function autoResize(el) {
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = MAX_ROWS * LINE_HEIGHT;
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = newHeight + "px";
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  useEffect(() => {
    autoResize(textareaRef.current);
  }, [input]);

  // Garante uma sessão caso a página seja aberta sem sessaoId (AppRoutes já tenta, isto é só um fallback)
  useEffect(() => {
    let cancelado = false;

    async function garantirSessao() {
      if (!user_id) return; // sem usuário, não cria
      if (sessaoId) return; // já existe
      try {
        setLoadingSessao(true);
        const novoId = await criarSessaoFallback(user_id);
        if (cancelado) return;
        localStorage.setItem("sessao_id", novoId);
        setSessaoId(novoId);
        navigate(`/chat/${novoId}`, { replace: true });
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
  }, [user_id, sessaoId, navigate]);

  // Scroll automático para o fim
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // Preflight + carregar histórico com cancelamento (respeita modo leitura)
  useEffect(() => {
    setErro("");
    if (!sessaoId) return;

    // aborta a requisição anterior, se houver
    if (histAbortRef.current) {
      try { histAbortRef.current.abort(); } catch {}
    }
    const controller = new AbortController();
    histAbortRef.current = controller;

    (async () => {
      try {
        // 0) Preflight: status + dono
        const metaRes = await fetch(apiUrl(`/sessao/${encodeURIComponent(sessaoId)}`), {
          signal: controller.signal,
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!metaRes.ok && metaRes.status !== 304) {
          const text = await metaRes.text().catch(() => "");
          throw new Error(text || "Falha ao consultar sessão.");
        }

        let statusAtual = "aberta";
        let donoDaSessao = true;

        if (metaRes.status !== 304) {
          const meta = await metaRes.json();
          statusAtual = String(meta?.sessao?.status || "").toLowerCase();
          donoDaSessao = String(meta?.sessao?.user_id || "") === String(user_id || "");
        }

        const estamosEmChatComId = Boolean(sessaoIdFromUrl);

        if (estamosEmChatComId) {
          // quando acessamos /chat/:id, nunca trocamos de sessão — apenas habilita modo leitura se necessário
          const somenteLeitura = !(statusAtual === "aberta" && donoDaSessao);
          setReadOnly(somenteLeitura);
        } else {
          // quando acessamos /chat (sem :id), se a sessão não estiver aberta, cria uma nova
          if (statusAtual !== "aberta") {
            const rNova = await fetch(apiUrl("/nova-sessao"), {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              cache: "no-store",
              body: JSON.stringify({ user_id, mensagem: "Nova sessão (status inválido detectado)" }),
              signal: controller.signal,
            });
            if (!rNova.ok) {
              const t = await rNova.text().catch(() => "");
              throw new Error(t || "Erro ao abrir nova sessão.");
            }
            const jNova = await rNova.json().catch(() => ({}));
            const novoId = jNova?.sessao?.id;
            if (!novoId) throw new Error("Resposta sem sessao.id");
            switchToSession(novoId, true);
            return;
          }
          setReadOnly(false);
        }

        // 1) Carrega o histórico (mesmo em read-only)
        const res = await fetch(apiUrl(`/historico/${encodeURIComponent(sessaoId)}`), {
          signal: controller.signal,
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (res.status === 204) { setMensagens([]); return; }
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || "Falha ao carregar histórico.");
        }
        const data = await res.json();
        const arr = Array.isArray(data?.mensagens) ? data.mensagens : [];
        setMensagens(arr);
      } catch (e) {
        if (e.name === "AbortError") return;
        setErro(e.message || "Falha de rede");
      }
    })();

    return () => {
      try { controller.abort(); } catch {}
      if (histAbortRef.current === controller) histAbortRef.current = null;
    };
  }, [sessaoId, user_id, sessaoIdFromUrl]);

  // util: troca de sessão com navegação e limpeza
  function switchToSession(newId, replace = false) {
    const id = String(newId);
    localStorage.setItem("sessao_id", id);
    setSessaoId(id);
    setMensagens([]);
    setInput("");
    navigate(`/chat/${id}`, { replace });
  }

  // ===== handleEnviar (restaurado) =====
  async function handleEnviar(e) {
    e?.preventDefault?.();
    setErro("");

    // bloqueios
    if (readOnly) {
      setErro("Sessão em modo leitura — abra Nova sessão para enviar mensagens.");
      return;
    }
    if (transitioning) return;

    const texto = input.trim();
    if (!texto || !user_id || !sessaoId) return;

    const localSessaoId = sessaoIdRef.current;

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
      // 1) Salva a mensagem
      const resSave = await fetch(apiUrl("/mensagem"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          sessao_id: localSessaoId,
          user_id,
          texto_mensagem: texto,
          origem: "usuario",
        }),
      });

      // Trata sessão encerrada (409) já no save
      if (!resSave.ok) {
        if (resSave.status === 409) {
          // Abre nova sessão e navega; usuário decide reenviar
          const rNova = await fetch(apiUrl("/nova-sessao"), {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            cache: "no-store",
            body: JSON.stringify({ user_id, mensagem: "Nova sessão (save 409)" }),
          });
          if (!rNova.ok) {
            const t = await rNova.text().catch(() => "");
            throw new Error(t || "Erro ao abrir nova sessão.");
          }
          const jNova = await rNova.json().catch(() => ({}));
          const novoId = jNova?.sessao?.id;
          if (!novoId) throw new Error("Resposta sem sessao.id");

          setMensagens((prev) => [
            ...prev,
            { origem: "sistema", texto_mensagem: "A sessão anterior foi encerrada. Uma nova sessão foi aberta. Reenvie sua última mensagem, se desejar.", data_mensagem: new Date().toISOString() },
          ]);
          switchToSession(novoId);
          return;
        }
        const errText = await resSave.text().catch(() => "");
        throw new Error(errText || "Não foi possível salvar a mensagem.");
      }

      // 2) Resposta da IA (com cancelamento)
      if (iaAbortRef.current) {
        try { iaAbortRef.current.abort(); } catch {}
      }
      iaAbortRef.current = new AbortController();

      const resIa = await fetch(apiUrl("/ia?debug=1"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        cache: "no-store",
        body: JSON.stringify({ user_id, sessao_id: localSessaoId, mensagem: texto }),
        signal: iaAbortRef.current.signal,
      });

      // Trata sessão encerrada (409) na IA
      if (!resIa.ok) {
        if (resIa.status === 409) {
          const rNova = await fetch(apiUrl("/nova-sessao"), {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            cache: "no-store",
            body: JSON.stringify({ user_id, mensagem: "Nova sessão (ia 409)" }),
          });
          if (!rNova.ok) {
            const t = await rNova.text().catch(() => "");
            throw new Error(t || "Erro ao abrir nova sessão.");
          }
          const jNova = await rNova.json().catch(() => ({}));
          const novoId = jNova?.sessao?.id;
          if (!novoId) throw new Error("Resposta sem sessao.id");

          setMensagens((prev) => [
            ...prev,
            { origem: "sistema", texto_mensagem: "A sessão anterior foi encerrada. Uma nova sessão foi aberta. Reenvie sua última mensagem, se desejar.", data_mensagem: new Date().toISOString() },
          ]);
          switchToSession(novoId);
          return;
        }
        const errText = await resIa.text().catch(() => "");
        throw new Error(errText || "Falha ao obter resposta da IA.");
      }

      const dataIa = await resIa.json();

      // Se a sessão mudou durante a requisição, descarta resposta para não “vazar” na nova sessão
      if (sessaoIdRef.current !== localSessaoId) return;

      const respostaBot = (dataIa?.resposta || "").trim();
      if (respostaBot) {
        setMensagens((prev) => [
          ...prev,
          { origem: "bot", texto_mensagem: respostaBot, data_mensagem: new Date().toISOString() },
        ]);
      }
    } catch (e) {
      if (e.name === "AbortError") return; // troca de sessão; não trata como erro
      setMensagens((prev) => [
        ...prev,
        { origem: "sistema", texto_mensagem: `Erro: ${e.message}`, data_mensagem: new Date().toISOString() },
      ]);
      setErro(e.message);
    } finally {
      setEnviando(false);
      iaAbortRef.current = null;
    }
  }

  // Encerrar sessão atual -> sempre encerra, cria nova, navega para ela
  async function encerrarSessao() {
    if (!sessaoId) {
      alert("Nenhuma sessão aberta.");
      return;
    }
    const sessaoEncerrandoId = sessaoId;

    try {
      // aborta qualquer IA em voo
      if (iaAbortRef.current) {
        try { iaAbortRef.current.abort(); } catch {}
        iaAbortRef.current = null;
      }

      setTransitioning(true);
      setLoadingSessao(true);

      // fecha atual
      const r = await fetch(apiUrl("/finalizar-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        cache: "no-store",
        body: JSON.stringify({ sessao_id: sessaoEncerrandoId, user_id }),
      });
      const jText = await r.text().catch(() => "");
      if (!r.ok) throw new Error(jText || "Erro ao encerrar sessão.");
      const j = jText ? JSON.parse(jText) : {};

      // feedback (count) em background amigável
      let abrirModal = false;
      try {
        const encerradas = await contarSessoesEncerradas(user_id);
        abrirModal = deveAbrirFeedback(encerradas, ambiente);
      } catch (e) {
        console.warn("[feedback] Falha ao contar sessões, seguindo sem modal:", e);
      }

      // cria nova e navega
      const rNova = await fetch(apiUrl("/nova-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        cache: "no-store",
        body: JSON.stringify({ user_id, mensagem: "Nova sessão (após encerrar)" }),
      });
      if (!rNova.ok) {
        const t = await rNova.text().catch(() => "");
        throw new Error(t || "Erro ao abrir nova sessão.");
      }
      const jNova = await rNova.json().catch(() => ({}));
      const novoId = jNova?.sessao?.id;
      if (!novoId) throw new Error("Resposta sem sessao.id");

      if (abrirModal) {
        setFeedbackSessaoId(String(sessaoEncerrandoId));
        setShowFeedback(true);
      }

      switchToSession(novoId);
    } catch (e) {
      alert(`Erro: ${e.message}`);
    } finally {
      setLoadingSessao(false);
      setTransitioning(false);
    }
  }

  // Nova sessão:
  // - se sessão atual está vazia (sem mensagens), NO-OP
  // - se tem mensagens, encerra atual, cria nova e navega
  async function abrirNovaSessao() {
    if (!user_id) return alert("Usuário não identificado.");
    if (!sessaoId) return alert("Nenhuma sessão ativa."); // fallback

    const estaVazia = mensagens.length === 0;

    if (estaVazia) {
      // nada a fazer: já está numa sessão nova/limpa
      setMensagens((prev) => [
        ...prev,
        {
          origem: "sistema",
          texto_mensagem: "Você já está em uma sessão nova.",
          data_mensagem: new Date().toISOString(),
        },
      ]);
      return;
    }

    try {
      // aborta qualquer IA em voo
      if (iaAbortRef.current) {
        try { iaAbortRef.current.abort(); } catch {}
        iaAbortRef.current = null;
      }

      setTransitioning(true);
      setLoadingSessao(true);

      // encerra atual
      const rEnd = await fetch(apiUrl("/finalizar-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        cache: "no-store",
        body: JSON.stringify({ sessao_id: sessaoIdRef.current, user_id }),
      });
      if (!rEnd.ok) {
        const t = await rEnd.text().catch(() => "");
        throw new Error(t || "Erro ao encerrar sessão.");
      }

      // cria nova
      const rNova = await fetch(apiUrl("/nova-sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        cache: "no-store",
        body: JSON.stringify({ user_id, mensagem: "Nova sessão (solicitada pelo usuário)" }),
      });
      if (!rNova.ok) {
        const t = await rNova.text().catch(() => "");
        throw new Error(t || "Erro ao abrir nova sessão.");
      }
      const jNova = await rNova.json().catch(() => ({}));
      const novoId = jNova?.sessao?.id;
      if (!novoId) throw new Error("Resposta sem sessao.id");

      switchToSession(novoId);
    } catch (e) {
      alert(`Erro: ${e.message}`);
    } finally {
      setLoadingSessao(false);
      setTransitioning(false);
    }
  }

  // UI
  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-4rem)] flex flex-col p-4">
      <header className="pb-3 border-b">
        <h1 className="text-xl font-semibold">AlanBot — Chat</h1>
        <div className="text-sm text-gray-500 flex items-center gap-3 flex-wrap">
          <span>
            Usuário: <b>{user_name}</b> • Sessão: <code>{sessaoId || "-"}</code>
          </span>

          {/* Passa handlers explicitamente para o menu do topo */}
          <TopChatMenu
            className="ml-auto"
            onNovaSessao={abrirNovaSessao}
            onEncerrarSessao={encerrarSessao}
            disabled={loadingSessao || transitioning || enviando}
          />
        </div>
      </header>

      {/* Aviso de somente leitura */}
      {readOnly && (
        <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 text-amber-900 px-3 py-2 text-sm">
          Esta sessão está <b>encerrada</b> ou não pertence a você. Você pode ler o histórico,
          mas para enviar novas mensagens clique em <b>Nova sessão</b>.
        </div>
      )}

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

      <form onSubmit={handleEnviar} className="pt-3 border-t flex items-end gap-2">
        <textarea
          ref={textareaRef}
          className="flex-1 border rounded px-3 py-2 resize-none overflow-hidden leading-6"
          placeholder={
            transitioning || loadingSessao
              ? "Trocando de sessão..."
              : readOnly
              ? "Sessão em modo leitura — abra Nova sessão para continuar"
              : "Escreva sua mensagem…"
          }
          value={input}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onInput={(e) => autoResize(e.currentTarget)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleEnviar(e);
            }
          }}
          disabled={!sessaoId || !user_id || enviando || loadingSessao || transitioning || readOnly}
          aria-label="Mensagem"
        />
        <button
          type="submit"
          disabled={
            !input.trim() || enviando || !sessaoId || loadingSessao || transitioning || readOnly
          }
          className="bg-black text-white px-4 py-2 rounded"
        >
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {erro && <div className="text-red-600 text-sm mt-2">Erro: {erro}</div>}

      {/* Modal de feedback: abre após encerrar sessão conforme frequência */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmitted={() => {
          setMensagens((prev) => [
            ...prev,
            {
              origem: "sistema",
              texto_mensagem: "Obrigado pelo feedback.",
              data_mensagem: new Date().toISOString(),
            },
          ]);
        }}
        userId={user_id}
        sessaoId={feedbackSessaoId}
        ambiente={ambiente}
        modeloAi={undefined}
        versaoApp={undefined}
        motivoGatilho={"intervalo_sessoes"}
      />
    </div>
  );
}
