import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Notifications from './components/Notifications';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Lista from './pages/Lista';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Encabezado de la aplicación */}
          <header className="bg-primary text-white py-4 shadow-lg">
            <div className="container">
              <h1 className="m-0">Sistema de Gestión de Tickets de Soporte</h1>
            </div>
          </header>

          {/* Navegación */}
          <Navbar />

          {/* Contenido principal con rutas */}
          <main className="container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/lista" element={<Lista />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-dark text-white text-center py-3 mt-5">
            <div className="container">
              <p className="m-0">© 2025 Sistema de Tickets - Todos los derechos reservados</p>
            </div>
          </footer>

          {/* Notificaciones */}
          <Notifications />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;