import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function Home() {
  const { user } = useAppContext();

  return (
    <div className="row">
      <div className="col-lg-8 mx-auto">
        {/* Hero Section */}
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body p-5 text-center">
            <h2 className="mb-3">¡Bienvenido al Sistema de Tickets!</h2>
            <p className="text-muted mb-4">
              Hola <strong>{user.name}</strong>, gestiona tus tickets de soporte de manera eficiente.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/registro" className="btn btn-primary btn-lg">
                ➕ Crear Nuevo Ticket
              </Link>
              <Link to="/lista" className="btn btn-outline-primary btn-lg">
                📋 Ver Mis Tickets
              </Link>
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 mb-3">🎫</div>
                <h5>Gestión de Tickets</h5>
                <p className="text-muted mb-0">
                  Crea y administra tickets de soporte técnico fácilmente
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 mb-3">⚡</div>
                <h5>Respuesta Rápida</h5>
                <p className="text-muted mb-0">
                  Seguimiento en tiempo real del estado de tus solicitudes
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 mb-3">📊</div>
                <h5>Organización</h5>
                <p className="text-muted mb-0">
                  Categoriza y prioriza tus tickets por importancia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">¿Cómo funciona?</h5>
            <ol className="mb-0">
              <li className="mb-2">
                <strong>Crea un ticket:</strong> Describe tu problema o consulta
              </li>
              <li className="mb-2">
                <strong>Asigna prioridad:</strong> Selecciona la urgencia de tu solicitud
              </li>
              <li className="mb-2">
                <strong>Seguimiento:</strong> Revisa el estado en la lista de tickets
              </li>
              <li>
                <strong>Resolución:</strong> Recibe respuesta del equipo de soporte
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
