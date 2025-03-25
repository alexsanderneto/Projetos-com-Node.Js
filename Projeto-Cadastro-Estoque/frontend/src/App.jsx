import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CadastroProduto from "./pages/CadastroProduto";
import LayoutPrincipal from "./LayoutPrincipal";
import Gerenciar from "./pages/Gerenciar";
import Relatorio from "./pages/RelatorioPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Rota Protegida do Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <LayoutPrincipal />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Dashboard />} />
          <Route path="cadastro" element={<CadastroProduto />} />
          <Route path="gerenciar" element={<Gerenciar />} />

          <Route path="relatorio" element={<Relatorio />} />
        </Route>
      </Routes>
    </Router>
  );
}

// Função que protege rotas privadas
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
