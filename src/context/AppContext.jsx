import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Estado global para usuario autenticado
  const [user, setUser] = useState({
    name: 'Usuario Demo',
    email: 'demo@tickets.com',
    role: 'user'
  });

  // Estado global para tema/configuración
  const [theme, setTheme] = useState('light');

  // Estado global para notificaciones
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-eliminar notificación después de 3 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 3000);
  };

  const value = {
    user,
    setUser,
    theme,
    setTheme,
    notifications,
    addNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
