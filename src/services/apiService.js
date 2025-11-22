import axios from "axios";

let localTickets = [];
let nextId = 1;

const initializeTickets = () => {
  if (localTickets.length === 0) {
    localTickets = [
      {
        id: nextId++,
        titulo: "Error en login",
        descripcion: "No puedo iniciar sesión en el sistema",
        categoria: "tecnico",
        prioridad: "alta",
        estado: "abierto",
        fecha: new Date().toISOString(),
        usuario: "Usuario Demo",
      },
      {
        id: nextId++,
        titulo: "Consulta sobre facturación",
        descripcion: "Necesito información sobre mi última factura",
        categoria: "facturacion",
        prioridad: "media",
        estado: "en-progreso",
        fecha: new Date(Date.now() - 86400000).toISOString(),
        usuario: "Usuario Demo",
      },
    ];
  }
};

const apiService = {
  /**
   * Obtener todos los tickets
   * @returns {Promise<Array>} Lista de tickets
   */
  getAll: async () => {
    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      initializeTickets();

      // Devolver copia de los tickets locales
      return {
        data: [...localTickets],
        status: 200,
      };
    } catch (error) {
      console.error("Error al obtener tickets:", error);
      throw error;
    }
  },

  /**
   * Obtener un ticket por ID
   * @param {number} id - ID del ticket
   * @returns {Promise<Object>} Ticket encontrado
   */
  getById: async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const ticket = localTickets.find((t) => t.id === id);

      if (!ticket) {
        throw new Error("Ticket no encontrado");
      }

      return {
        data: ticket,
        status: 200,
      };
    } catch (error) {
      console.error("Error al obtener ticket:", error);
      throw error;
    }
  },

  /**
   * Crear un nuevo ticket
   * @param {Object} ticketData - Datos del nuevo ticket
   * @returns {Promise<Object>} Ticket creado
   */
  add: async (ticketData) => {
    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newTicket = {
        id: nextId++,
        ...ticketData,
        estado: "abierto",
        fecha: new Date().toISOString(),
      };

      localTickets.push(newTicket);

      return {
        data: newTicket,
        status: 201,
        message: "Ticket creado exitosamente",
      };
    } catch (error) {
      console.error("Error al crear ticket:", error);
      throw error;
    }
  },

  /**
   * Actualizar un ticket existente
   * @param {number} id - ID del ticket
   * @param {Object} ticketData - Datos actualizados
   * @returns {Promise<Object>} Ticket actualizado
   */
  update: async (id, ticketData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const index = localTickets.findIndex((t) => t.id === id);

      if (index === -1) {
        throw new Error("Ticket no encontrado");
      }

      localTickets[index] = {
        ...localTickets[index],
        ...ticketData,
      };

      return {
        data: localTickets[index],
        status: 200,
        message: "Ticket actualizado exitosamente",
      };
    } catch (error) {
      console.error("Error al actualizar ticket:", error);
      throw error;
    }
  },

  /**
   * Eliminar un ticket por ID
   * @param {number} id - ID del ticket a eliminar
   * @returns {Promise<void>} Confirmación de eliminación
   */
  remove: async (id) => {
    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Eliminar ticket de los datos locales
      localTickets = localTickets.filter((ticket) => ticket.id !== id);
    } catch (error) {
      console.error("Error al eliminar ticket:", error);
      throw error;
    }
  },
};

export default apiService;
