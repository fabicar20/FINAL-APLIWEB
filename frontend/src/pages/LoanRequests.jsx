import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./LoanRequests.css";

function LoanRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  async function loadRequests() {
    const response = await api.get("/loan-requests", {
      params: status ? { status } : {},
    });

    setRequests(response.data);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleAction(id, action) {
    setMessage("");

    try {
      await api.post(`/loan-requests/${id}/${action}`);
      setMessage("Solicitud actualizada correctamente");
      loadRequests();
    } catch {
      setMessage("No se pudo actualizar la solicitud");
    }
  }

  async function handleFilter(event) {
    event.preventDefault();
    loadRequests();
  }

  function getStatusText(value) {
    const labels = {
      pending: "Pendiente",
      approved: "Aprobada",
      rejected: "Rechazada",
      returned: "Devuelta",
    };

    return labels[value] || value;
  }

  return (
    <section className="requests-page">
      <div className="section-header">
        <div>
          <h2>Solicitudes</h2>
          <p>Historial, aprobación y devolución de préstamos</p>
        </div>
      </div>

      <form className="requests-filter" onSubmit={handleFilter}>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobadas</option>
          <option value="rejected">Rechazadas</option>
          <option value="returned">Devueltas</option>
        </select>

        <button type="submit">Filtrar</button>
      </form>

      {message && <p className="requests-message">{message}</p>}

      <div className="requests-list">
        {requests.map((request) => (
          <article className="request-card" key={request.id}>
            <div className="request-main">
              <div>
                <span className={`request-status ${request.status}`}>
                  {getStatusText(request.status)}
                </span>
                <h3>{request.equipment?.name}</h3>
                <p>{request.observations || "Sin observaciones"}</p>
              </div>

              <div className="request-meta">
                <strong>Cantidad: {request.quantity}</strong>
                <span>Solicitante: {request.user?.name}</span>
                <span>Fecha: {request.request_date}</span>
              </div>
            </div>

            {user?.role === "admin" && (
              <div className="request-actions">
                {request.status === "pending" && (
                  <>
                    <button
                      type="button"
                      className="approve"
                      onClick={() => handleAction(request.id, "approve")}
                    >
                      Aprobar
                    </button>

                    <button
                      type="button"
                      className="reject"
                      onClick={() => handleAction(request.id, "reject")}
                    >
                      Rechazar
                    </button>
                  </>
                )}

                {request.status === "approved" && (
                  <button
                    type="button"
                    className="return"
                    onClick={() => handleAction(request.id, "return")}
                  >
                    Registrar devolución
                  </button>
                )}
              </div>
            )}
          </article>
        ))}

        {requests.length === 0 && (
          <p className="empty-state">No hay solicitudes para mostrar.</p>
        )}
      </div>
    </section>
  );
}

export default LoanRequests;
