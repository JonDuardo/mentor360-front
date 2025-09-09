import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user_id");

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("sessao_id");
    navigate("/"); // volta para a landing page
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-10 flex items-center justify-between px-6 py-3">
      <span className="font-extrabold text-lg tracking-tight">AlanBot</span>
      <nav className="flex gap-4">
        {/* Links comuns */}
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
          Home
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Sobre
        </Link>
        <Link
          to="/politica"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Privacidade
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/chat"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Chat
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/instrucoes"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Como Usar
            </Link>
            <Link
              to="/cadastro"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Cadastre-se
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
