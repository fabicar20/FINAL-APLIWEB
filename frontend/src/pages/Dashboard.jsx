import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Inventory from "./Inventory";
import LoanRequests from "./LoanRequests";
import "./Dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState("inventory");

  return (
    <main className="dashboard-layout">
      <aside className="sidebar">
        <div>
          <h1>Laboratorio</h1>
          <p>{user?.name}</p>
          <span>{user?.role}</span>

          <nav className="sidebar-nav">
            <button
              className={activeView === "inventory" ? "active" : ""}
              onClick={() => setActiveView("inventory")}
            >
              Inventario
            </button>

            <button
              className={activeView === "requests" ? "active" : ""}
              onClick={() => setActiveView("requests")}
            >
              Solicitudes
            </button>
          </nav>
        </div>

        <button className="logout-button" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>

      <section className="dashboard-content">
        {activeView === "inventory" && <Inventory />}
        {activeView === "requests" && <LoanRequests />}
      </section>
    </main>
  );
}

export default Dashboard;
