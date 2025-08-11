// AppRoutes.js
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import CadastroPage from "./pages/CadastroPage";
import CadastroPessoasPage from "./pages/CadastroPessoasPage";
import LoginPage from "./pages/LoginPage";
import SessoesPage from "./pages/SessoesPage";
import PoliticaPage from "./pages/PoliticaPage";
import HomePage from "./pages/HomePage";




// Base de API robusta (fallback local e saneamento)
const API = (process.env.REACT_APP_API_BASE_URL || "http://localhost:3000")
  .trim()
  .replace(/\/+$/, "");

// Função utilitária para iniciar sessão (rota correta)
async function iniciarSessao(user_id) {
  if (!user_id) throw new Error("user_id ausente para iniciar sessão");

  // sempre limpamos o id antigo antes
  localStorage.removeItem("sessao_id");

  // 1) tenta criar nova
  const resp = await fetch(`${API}/nova-sessao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, mensagem: "Início da sessão" }),
  });

  const text = await resp.text();
  if (resp.ok) {
    let data;
    try { data = JSON.parse(text); } catch {
      throw new Error("Resposta da API não é JSON: " + text.slice(0, 120));
    }
    const id = data?.sessao?.id;
    if (!id) throw new Error("Resposta sem sessao.id");
    return id;
  }

  // 2) fallback: tenta reaproveitar sessão aberta existente
  try {
    const r2 = await fetch(`${API}/sessao-aberta/${encodeURIComponent(user_id)}`);
    const t2 = await r2.text();
    if (!r2.ok) throw new Error(t2 || "Falha no fallback");
    const data2 = JSON.parse(t2);
    const id2 = data2?.sessao?.id;
    if (!id2) throw new Error("Fallback sem sessao.id");
    return id2;
  } catch {
    // 3) último recurso: aguarda 600ms e tenta NOVAMENTE criar nova
    await new Promise(res => setTimeout(res, 600));
    const r3 = await fetch(`${API}/nova-sessao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, mensagem: "Início da sessão" }),
    });
    const t3 = await r3.text();
    if (!r3.ok) throw new Error(t3 || "Erro ao criar nova sessão.");
    const d3 = JSON.parse(t3);
    const id3 = d3?.sessao?.id;
    if (!id3) throw new Error("Resposta sem sessao.id");
    return id3;
  }
}

function AppRoutes() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const user_id = localStorage.getItem("user_id");
    const nome = localStorage.getItem("user_name");
    if (user_id && nome) return { user_id, nome };
    return null;
  });

  const [sessaoId, setSessaoId] = useState(
    () => localStorage.getItem("sessao_id") || ""
  );

  useEffect(() => {
    const criarSePrecisar = async () => {
      if (user && !sessaoId) {
        try {
          localStorage.removeItem("sessao_id");
          const novaSessaoId = await iniciarSessao(user.user_id);
          setSessaoId(novaSessaoId);
          localStorage.setItem("sessao_id", novaSessaoId);
        } catch (err) {
          alert("Erro ao iniciar sessão automaticamente: " + err.message);
        }
      }
    };
    criarSePrecisar();
  }, [user, sessaoId]);

  async function handleLogin({ user_id, nome }) {
    try {
      setUser({ user_id, nome });
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("user_name", nome);
      localStorage.removeItem("sessao_id");

      const novaSessaoId = await iniciarSessao(user_id);
      setSessaoId(novaSessaoId);
      localStorage.setItem("sessao_id", novaSessaoId);

      navigate("/chat");
    } catch (err) {
      alert("Erro ao iniciar sessão: " + err.message);
    }
  }

  return (
    <main className="pt-16">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/chat" />} />

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
              <ChatPage
                user_id={user.user_id}
                user_name={user.nome}
              />
            )
          }
        />

        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/pessoas" element={<CadastroPessoasPage />} />
        <Route path="/sessoes" element={<SessoesPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/politica" element={<PoliticaPage />} />


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

