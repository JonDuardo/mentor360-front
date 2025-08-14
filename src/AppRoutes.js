// src/AppRoutes.js
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import CadastroPage from "./pages/CadastroPage";
import CadastroPessoasPage from "./pages/CadastroPessoasPage";
import LoginPage from "./pages/LoginPage";
import SessoesPage from "./pages/SessoesPage";
import PoliticaPage from "./pages/PoliticaPage";
import HomePage from "./pages/HomePage";
import { apiUrl } from "./lib/api"; // helper para montar URLs corretas (local/Render)

// --- Função utilitária para iniciar sessão (reaproveita se já existir)
async function iniciarSessao(user_id) {
  if (!user_id) throw new Error("user_id ausente para iniciar sessão");
  // limpa resíduo antigo
  localStorage.removeItem("sessao_id");

  // 1) tenta reaproveitar sessão aberta
  const rAberta = await fetch(
    apiUrl(`/sessao-aberta/${encodeURIComponent(user_id)}`)
  );
  if (rAberta.ok) {
    const j = await rAberta.json();
    const id = j?.sessao?.id;
    if (id) return id;
  }

  // 2) se não houver, cria nova
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
  return id;
}

function AppRoutes() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const user_id = localStorage.getItem("user_id");
    const nome = localStorage.getItem("user_name");
    return user_id ? { user_id, nome: nome || "" } : null;
  });

  const [sessaoId, setSessaoId] = useState(
    () => localStorage.getItem("sessao_id") || ""
  );

  // Inicia sessão automaticamente quando tiver user e não houver sessão
  useEffect(() => {
    const criarSePrecisar = async () => {
      if (user && !sessaoId) {
        try {
          localStorage.removeItem("sessao_id");
          const novaSessaoId = await iniciarSessao(user.user_id);
          setSessaoId(novaSessaoId);
          localStorage.setItem("sessao_id", String(novaSessaoId));
        } catch (err) {
          alert("Erro ao iniciar sessão automaticamente: " + err.message);
        }
      }
    };
    criarSePrecisar();
  }, [user, sessaoId]);

  // Callback do Login: aceita diferentes formatos de payload
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
      localStorage.removeItem("sessao_id");

      const novaSessaoId = await iniciarSessao(user_id);
      setSessaoId(novaSessaoId);
      localStorage.setItem("sessao_id", String(novaSessaoId));

      navigate("/chat");
    } catch (err) {
      alert("Erro ao iniciar sessão: " + err.message);
    }
  }

  return (
    <main className="pt-16">
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Chat (exige usuário e sessão) */}
        <Route
          path="/chat"
          element={
            !user || !sessaoId ? (
              <Navigate to="/login" />
            ) : (
              <ChatPage
                sessao_id={sessaoId}
                user_id={user.user_id}
                user_name={user.nome}
              />
            )
          }
        />

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

        {/* Demais páginas */}
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/pessoas" element={<CadastroPessoasPage />} />
        <Route path="/sessoes" element={<SessoesPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/politica" element={<PoliticaPage />} />

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
