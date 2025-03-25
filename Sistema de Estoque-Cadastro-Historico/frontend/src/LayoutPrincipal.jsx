import { Routes, Route, Link, Outlet } from "react-router-dom";
import "./css/style.css";

export default function LayoutPrincipal() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center text-3xl font-bold shadow-lg tracking-wide">
        🏢 Sistema de Gestão
      </header>

      <nav className="bg-blue-500 p-4 flex justify-center gap-8 text-white font-semibold shadow-md rounded-b-lg">
        <Link
          to="/dashboard"
          className="hover:text-gray-200 transition text-lg"
        >
          🏠 Home
        </Link>
        <Link
          to="/dashboard/cadastro"
          className="hover:text-gray-200 transition text-lg"
        >
          📝 Cadastrar Produto
        </Link>
        <Link
          to="/dashboard/gerenciar"
          className="hover:text-gray-200 transition text-lg"
        >
          ⚙️ Gerenciar Produtos
        </Link>
        <Link
          to="/dashboard/relatorio"
          className="hover:text-gray-200 transition text-lg"
        >
          📊 Relatórios
        </Link>
      </nav>

      <main className="flex-grow p-8 flex justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-300">
          {/* Aqui será renderizada a página correspondente à rota */}
          <Outlet />
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-6 mt-8 shadow-md text-lg rounded-t-lg">
        © 2025 Sistema de Gestão - Todos os direitos reservados
      </footer>
    </div>
  );
}
