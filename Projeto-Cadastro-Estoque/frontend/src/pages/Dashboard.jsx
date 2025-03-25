import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token
    navigate("/login"); // Redireciona para o login
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default Dashboard;
