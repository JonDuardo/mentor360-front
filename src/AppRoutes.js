// src/AppRoutes.js
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import CadastroPage from "./pages/CadastroPage";
import CadastroPessoasPage from "./pages/CadastroPessoasPage";
import LoginPage from "./pages/LoginPage";
import SessoesPage from "./pages/SessoesPage";
import PoliticaPage from "./pages/PoliticaPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import { apiUrl } from "./lib/api";
import InstructionsPage from "./pages/InstructionsPage";

/* ================== Util: iniciar sessão (reaproveita aberta) ================== */
async function iniciarSessao(user_id) {
  if (!user_id) throw new Error("user_id ausente para iniciar sessão");
  // zera qualquer sessão velha antes de decidir
  localStorage.removeItem("sessao_id");

  // 1) tenta reaproveitar sessão aberta
  const rAberta = await fetch(apiUrl(`/sessao-aberta/${encodeURIComponent(user_id)}`));
  if (rAberta.ok) {
    const j = await rAberta.json();
    const id = j?.sessao?.id;
    if (id) return String(id);
  }

  // 2) cria nova
  const rNova = await fetch(apiUrl("/nova-sessao"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, mensagem: "Início da sessão" }),
  });

  const t = await rNova.text();
  if (!rNova.ok) {
    throw new Error(`Erro ao criar nova sessão: ${rNova.status} ${t}`);
  }
  let data;
  try {
    data = JSON.parse(t);
  } catch {
    throw new Error("Resposta da API não é JSON: " + t.slice(0, 160));
  }
  const id = data?.sessao?.id;
  if (!id) throw new Error("Resposta sem sessao.id");
  return String(id);
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================== Autenticação em memória ================== */
  const [user, setUser] = useState(() => {
    const user_id = localStorage.getItem("user_id");
    const nome = localStorage.getItem("user_name");
    return user_id ? { user_id, nome: nome || "" } : null;
  });

  /* ================== Sessão atual (mantida em memória + localStorage) ================== */
  const [sessaoId, setSessaoId] = useState(() => localStorage.getItem("sessao_id") || "");

  /* ===== A) Se a URL é /chat/:id, sincroniza estado/localStorage e NUNCA cria nova ===== */
  useEffect(() => {
    const m = location.pathname.match(/^\/chat\/([a-f0-9-]+)$/i);
    if (!m) return;

    const idFromUrl = String(m[1]);
    if (!idFromUrl) return;

    if (sessaoId !== idFromUrl) {
      setSessaoId(idFromUrl);
      localStorage.setItem("sessao_id", idFromUrl);
    }
    // importantíssimo: não criar sessão aqui
    // (o ChatPage usará o :sessaoId da URL)
  }, [location.pathname, sessaoId]);

  /* ===== B) Auto-criar sessão SOMENTE quando estiver em /chat (sem :id) ===== */
  useEffect(() => {
    const path = location.pathname || "";

    // só roda se: autenticado, em /chat sem id, e ainda não temos sessaoId
    const emChatSemId = path === "/chat" || path === "/chat/";
    if (!user || !emChatSemId || sessaoId) return;

    let cancelled = false;
    (async () => {
      try {
        const novaId = await iniciarSessao(user.user_id);
        if (cancelled) return;
        setSessaoId(novaId);
        localStorage.setItem("sessao_id", novaId);
        // já navega para /chat/:id para padronizar (e evitar rodar efeitos de novo)
        navigate(`/chat/${novaId}`, { replace: true });
      } catch (err) {
        if (!cancelled) alert("Erro ao iniciar sessão automaticamente: " + err.message);
      }
    })();

    return () => { cancelled = true; };
  }, [user, sessaoId, location.pathname, navigate]);

  /* ================== Login: cria sessão e vai direto para /chat/:id ================== */
  async function handleLogin(payload) {
    try {
      const user_id =
        payload?.user_id ??
        payload?.id ??
        payload?.user?.id ??
        localStorage.getItem("user_id");
      const nome =
        payload?.nome ??
        payload?.name ??
        payload?.user?.name ??
        localStorage.getItem("user_name") ??
        "";

      if (!user_id) throw new Error("Login sem user_id");

      setUser({ user_id, nome });
      localStorage.setItem("user_id", String(user_id));
      if (nome) localStorage.setItem("user_name", String(nome));

      // garante que não herdamos uma sessão antiga
      localStorage.removeItem("sessao_id");
      setSessaoId("");

      const novaSessaoId = await iniciarSessao(user_id);
      setSessaoId(novaSessaoId);
      localStorage.setItem("sessao_id", String(novaSessaoId));

      // vai DIRETO para /chat/:id para não disparar auto-criação concorrente
      navigate(`/chat/${novaSessaoId}`, { replace: true });
    } catch (err) {
      alert("Erro ao iniciar sessão: " + err.message);
    }
  }

  /* ================== Rotas ================== */
  return (
    <main className="pt-16">
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Sobre o Alan */}
        <Route path="/about" element={<AboutPage />} />

        {/* Chat COM ID (retomar / URL direta) — exige user */}
        <Route
          path="/chat/:sessaoId"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : (
              <ChatPage user_id={user.user_id} user_name={user.nome} />
            )
          }
        />

        {/* Chat SEM ID — exige user; AppRoutes cria e redireciona para /chat/:id */}
        <Route
          path="/chat"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : (
              // quando sessaoId ainda não existe, mostramos uma "tela vazia" leve;
              // o useEffect acima cria e redireciona.
              <ChatPage
                key={sessaoId || "pending"}
                sessao_id={sessaoId || undefined}
                user_id={user.user_id}
                user_name={user.nome}
              />
            )
          }
        />

        {/* Demais páginas */}
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/pessoas" element={<CadastroPessoasPage />} />
        <Route path="/sessoes" element={<SessoesPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/politica" element={<PoliticaPage />} />
        <Route path="/instrucoes" element={<InstructionsPage />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div style={{ padding: 32, textAlign: "center" }}>
              <h2>Página não encontrada</h2>
              <p>
                Verifique o endereço digitado ou volte para a{" "}
                <a href="/">página inicial</a>.
              </p>
            </div>
          }
        />
      </Routes>
    </main>
  );
}

export default AppRoutes;

