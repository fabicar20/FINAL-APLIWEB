import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Inventory.css";

function Inventory() {
  const { user } = useAuth();

  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loanQuantities, setLoanQuantities] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    code: "",
    category: "",
    description: "",
    quantity: 1,
    available_quantity: 1,
    status: "available",
  });
  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    description: "",
    quantity: 1,
  });

  async function loadEquipment() {
    const response = await api.get("/equipment", {
      params: search ? { search } : {},
    });

    setEquipment(response.data);
  }

  useEffect(() => {
    loadEquipment();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      await api.post("/equipment", form);
      setForm({
        name: "",
        code: "",
        category: "",
        description: "",
        quantity: 1,
      });
      setMessage("Equipo creado correctamente");
      loadEquipment();
    } catch {
      setMessage("No se pudo crear el equipo. Revisa los datos.");
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    loadEquipment();
  }

  function handleLoanQuantityChange(equipmentId, value) {
    setLoanQuantities({
      ...loanQuantities,
      [equipmentId]: value,
    });
  }

  async function handleLoanRequest(equipmentId) {
    setMessage("");

    try {
      await api.post("/loan-requests", {
        equipment_id: equipmentId,
        quantity: Number(loanQuantities[equipmentId] || 1),
        observations: "Solicitud realizada desde el sistema web",
      });

      setMessage("Solicitud de préstamo creada correctamente");
    } catch {
      setMessage("No se pudo crear la solicitud de préstamo");
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      code: item.code,
      category: item.category,
      description: item.description || "",
      quantity: item.quantity,
      available_quantity: item.available_quantity,
      status: item.status,
    });
  }

  function handleEditChange(event) {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setMessage("");

    try {
      await api.put(`/equipment/${editingId}`, editForm);
      setMessage("Equipo actualizado correctamente");
      setEditingId(null);
      loadEquipment();
    } catch {
      setMessage("No se pudo actualizar el equipo");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este equipo?",
    );

    if (!confirmed) return;

    setMessage("");

    try {
      await api.delete(`/equipment/${id}`);
      setMessage("Equipo eliminado correctamente");
      loadEquipment();
    } catch {
      setMessage("No se pudo eliminar el equipo");
    }
  }

  return (
    <section className="inventory-page">
      <div className="section-header">
        <div>
          <h2>Inventario</h2>
          <p>Equipos y materiales disponibles en laboratorio</p>
        </div>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Buscar por nombre, código o categoría"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {user?.role === "admin" && (
        <form className="equipment-form" onSubmit={handleSubmit}>
          <h3>Agregar equipo</h3>

          <div className="form-grid">
            <input
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="code"
              placeholder="Código"
              value={form.code}
              onChange={handleChange}
              required
            />

            <input
              name="category"
              placeholder="Categoría"
              value={form.category}
              onChange={handleChange}
              required
            />

            <input
              name="quantity"
              type="number"
              min="1"
              placeholder="Cantidad"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit">Guardar equipo</button>

          {message && <p className="form-message">{message}</p>}
        </form>
      )}

      <div className="equipment-grid">
        {equipment.map((item) => (
          <article className="equipment-card" key={item.id}>
            {editingId === item.id ? (
              <form className="edit-form" onSubmit={handleUpdate}>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />

                <input
                  name="code"
                  value={editForm.code}
                  onChange={handleEditChange}
                  required
                />

                <input
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  required
                />

                <input
                  name="quantity"
                  type="number"
                  min="1"
                  value={editForm.quantity}
                  onChange={handleEditChange}
                  required
                />

                <input
                  name="available_quantity"
                  type="number"
                  min="0"
                  value={editForm.available_quantity}
                  onChange={handleEditChange}
                  required
                />

                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                >
                  <option value="available">Disponible</option>
                  <option value="unavailable">No disponible</option>
                </select>

                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                />

                <div className="edit-actions">
                  <button type="submit">Guardar</button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="card-top">
                  <span>{item.category}</span>
                  <strong>{item.code}</strong>
                </div>

                <h3>{item.name}</h3>
                <p>{item.description || "Sin descripción"}</p>

                <div className="availability">
                  <span>Total: {item.quantity}</span>
                  <span>Disponible: {item.available_quantity}</span>
                </div>

                <span className={`status ${item.status}`}>
                  {item.status === "available" ? "Disponible" : "No disponible"}
                </span>
                {item.available_quantity > 0 && (
                  <div className="loan-actions">
                    <input
                      type="number"
                      min="1"
                      max={item.available_quantity}
                      value={loanQuantities[item.id] || 1}
                      onChange={(event) =>
                        handleLoanQuantityChange(item.id, event.target.value)
                      }
                    />

                    <button
                      type="button"
                      onClick={() => handleLoanRequest(item.id)}
                    >
                      Solicitar préstamo
                    </button>
                  </div>
                )}
                {user?.role === "admin" && (
                  <div className="admin-actions">
                    <button type="button" onClick={() => startEdit(item)}>
                      Editar
                    </button>

                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Inventory;
