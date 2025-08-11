import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user_id");

  const handleLogout = () => {
    // remove dados locais
    localStorage.removeItem("user_id");
    localStorage.removeItem("sessao_id");
    navigate("/"); // volta para a landing page
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-10 flex items-center justify-between px-6 py-3">
      <span className="font-extrabold text-lg tracking-tight">
        Mentor Tríade
      </span>
      <nav className="flex gap-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
          Home
        </Link>
        {isLoggedIn && (
          <>
            <Link
              to="/chat"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Chat
            </Link>
            <Link
              to="/sessoes"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Sessões Anteriores
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </>
        )}
        {!isLoggedIn && (
          <>
            {/* Links de login/cadastro só na landing page */}
          </>
        )}
        <Link
          to="/politica"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Política de Privacidade
        </Link>
      </nav>
    </header>
  );
}
