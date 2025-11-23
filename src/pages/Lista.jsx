import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import apiService from "../services/apiService";

function Lista() {
  const { addNotification } = useAppContext();

  // Estado para tickets
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  // Estado para edición
  const [editando, setEditando] = useState(null);
  const [estadoEdicion, setEstadoEdicion] = useState("");

  // Cargar tickets al montar el componente
  useEffect(() => {
    cargarTickets();
  }, []);

  const cargarTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAll(true); // Forzar recarga desde el servidor

      // Validar que la respuesta sea un arreglo
      if (Array.isArray(response)) {
        setTickets(response);
      } else {
        console.error(
          "La respuesta de apiService.getAll no es un arreglo:",
          response
        );
        setTickets([]); // Asignar un arreglo vacío si la respuesta no es válida
        setError("Error: La respuesta de la API no es válida.");
      }
    } catch (err) {
      setError("Error al cargar los tickets");
      addNotification("Error al cargar los tickets", "danger");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ticket
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este ticket?")) {
      return;
    }

    try {
      await apiService.remove(id);
      setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
      addNotification("Ticket eliminado exitosamente", "success");
    } catch (err) {
      addNotification("Error al eliminar el ticket", "danger");
    }
  };

  // Actualizar estado del ticket
  const handleActualizarEstado = async (id) => {
    try {
      await apiService.update(id, { estado: estadoEdicion });
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === id ? { ...ticket, estado: estadoEdicion } : ticket
        )
      );
      addNotification("Estado actualizado exitosamente", "success");
      setEditando(null);
      setEstadoEdicion("");
    } catch (err) {
      addNotification("Error al actualizar el estado", "danger");
    }
  };

  // Asegurar que tickets sea un arreglo antes de filtrar
  const ticketsFiltrados = Array.isArray(tickets)
    ? tickets.filter((ticket) => {
        const coincideBusqueda =
          ticket.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
          ticket.descripcion.toLowerCase().includes(busqueda.toLowerCase());

        const coincideEstado =
          filtroEstado === "todos" || ticket.estado === filtroEstado;

        const coincidePrioridad =
          filtroPrioridad === "todos" || ticket.prioridad === filtroPrioridad;

        return coincideBusqueda && coincideEstado && coincidePrioridad;
      })
    : [];

  // Función para obtener badge de estado
  const getBadgeEstado = (estado) => {
    const badges = {
      abierto: "bg-info",
      "en-progreso": "bg-warning",
      resuelto: "bg-success",
      cerrado: "bg-secondary",
    };
    return badges[estado] || "bg-secondary";
  };

  // Función para obtener badge de prioridad
  const getBadgePrioridad = (prioridad) => {
    const badges = {
      baja: "bg-success",
      media: "bg-warning",
      alta: "bg-orange",
      critica: "bg-danger",
    };
    return badges[prioridad] || "bg-secondary";
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={cargarTickets}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Tickets de Soporte</h2>
        <button className="btn btn-outline-primary" onClick={cargarTickets}>
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Búsqueda */}
            <div className="col-md-4">
              <label className="form-label">🔍 Buscar</label>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por título o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Filtro por estado */}
            <div className="col-md-4">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="abierto">Abierto</option>
                <option value="en-progreso">En Progreso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            {/* Filtro por prioridad */}
            <div className="col-md-4">
              <label className="form-label">Prioridad</label>
              <select
                className="form-select"
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
              >
                <option value="todos">Todas las prioridades</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="mb-0">{tickets.length}</h3>
              <small className="text-muted">Total Tickets</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="mb-0 text-info">
                {tickets.filter((t) => t.estado === "abierto").length}
              </h3>
              <small className="text-muted">Abiertos</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="mb-0 text-warning">
                {tickets.filter((t) => t.estado === "en-progreso").length}
              </h3>
              <small className="text-muted">En Progreso</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="mb-0 text-success">
                {tickets.filter((t) => t.estado === "resuelto").length}
              </h3>
              <small className="text-muted">Resueltos</small>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de tickets */}
      {ticketsFiltrados.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <h4 className="alert-heading">No hay tickets</h4>
          <p>
            {tickets.length === 0
              ? "Aún no has creado ningún ticket."
              : "No se encontraron tickets con los filtros seleccionados."}
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {ticketsFiltrados.map((ticket) => (
            <div key={ticket.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm hover-shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className={`badge ${getBadgeEstado(ticket.estado)}`}>
                    {ticket.estado}
                  </span>
                  <span
                    className={`badge ${getBadgePrioridad(ticket.prioridad)}`}
                  >
                    {ticket.prioridad}
                  </span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{ticket.titulo}</h5>
                  <p className="card-text text-muted small">
                    {ticket.descripcion.length > 100
                      ? `${ticket.descripcion.substring(0, 100)}...`
                      : ticket.descripcion}
                  </p>
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>Categoría:</strong> {ticket.categoria}
                    </small>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>Fecha:</strong> {formatearFecha(ticket.fecha)}
                    </small>
                  </div>
                  <div>
                    <small className="text-muted">
                      <strong>Usuario:</strong> {ticket.usuario}
                    </small>
                  </div>

                  {/* Edición de estado */}
                  {editando === ticket.id ? (
                    <div className="mt-3">
                      <select
                        className="form-select form-select-sm mb-2"
                        value={estadoEdicion}
                        onChange={(e) => setEstadoEdicion(e.target.value)}
                      >
                        <option value="">Seleccionar estado</option>
                        <option value="abierto">Abierto</option>
                        <option value="en-progreso">En Progreso</option>
                        <option value="resuelto">Resuelto</option>
                        <option value="cerrado">Cerrado</option>
                      </select>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleActualizarEstado(ticket.id)}
                        >
                          ✓ Guardar
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setEditando(null);
                            setEstadoEdicion("");
                          }}
                        >
                          ✗ Cancelar
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="card-footer bg-white border-top-0">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary flex-fill"
                      onClick={() => {
                        setEditando(ticket.id);
                        setEstadoEdicion(ticket.estado);
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger flex-fill"
                      onClick={() => handleEliminar(ticket.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Lista;
