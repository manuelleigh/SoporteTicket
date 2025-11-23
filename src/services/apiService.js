import axios from "axios";

const BASE_URL = "http://localhost:5000";
const LOCAL_STORAGE_KEY = "tickets";

const apiService = {
  /**
   * Obtener todos los tickets
   * @param {boolean} forceRefresh
   * @returns {Promise<Array>}
   */
  getAll: async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cachedTickets = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cachedTickets) {
          return JSON.parse(cachedTickets);
        }
      }

      const response = await axios.get(`${BASE_URL}/tickets`);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
      throw error;
    }
  },

  /**
   * Crear un nuevo ticket
   * @param {Object} ticketData
   * @returns {Promise<Object>}
   */
  add: async (ticketData) => {
    try {
      const newTicket = {
        titulo: ticketData.titulo || "Título no especificado",
        descripcion: ticketData.descripcion || "Descripción no especificada",
        categoria: ticketData.categoria || "general",
        prioridad: ticketData.prioridad || "media",
        estado: ticketData.estado || "abierto",
        fecha: ticketData.fecha || new Date().toISOString(),
        usuario: ticketData.usuario || "Usuario Anónimo",
        ...ticketData,
      };

      const response = await axios.post(`${BASE_URL}/tickets`, newTicket);

      const cachedTickets =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      cachedTickets.push(response.data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cachedTickets));

      return response.data;
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      throw error;
    }
  },

  /**
   * Eliminar un ticket por ID
   * @param {number} id
   * @returns {Promise<void>}
   */
  remove: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/tickets/${id}`);

      // Actualizar localStorage
      const cachedTickets =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      const updatedTickets = cachedTickets.filter((ticket) => ticket.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTickets));
    } catch (error) {
      console.error("Error al eliminar el ticket:", error);
      throw error;
    }
  },

  /**
   * Actualizar un ticket por ID
   * @param {number} id
   * @param {Object} ticketData
   * @returns {Promise<Object>}
   */
  update: async (id, ticketData) => {
    try {
      const cachedTickets =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      const existingTicket =
        cachedTickets.find((ticket) => ticket.id === id) || {};

      const updatedTicket = {
        titulo:
          ticketData.titulo ||
          existingTicket.titulo ||
          "Título no especificado",
        descripcion:
          ticketData.descripcion ||
          existingTicket.descripcion ||
          "Descripción no especificada",
        categoria:
          ticketData.categoria || existingTicket.categoria || "general",
        prioridad: ticketData.prioridad || existingTicket.prioridad || "media",
        estado: ticketData.estado || existingTicket.estado || "abierto",
        fecha:
          ticketData.fecha || existingTicket.fecha || new Date().toISOString(),
        usuario:
          ticketData.usuario || existingTicket.usuario || "Usuario Anónimo",
        ...ticketData,
      };

      const response = await axios.put(
        `${BASE_URL}/tickets/${id}`,
        updatedTicket
      );

      const updatedTickets = cachedTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTickets));

      return response.data;
    } catch (error) {
      console.error("Error al actualizar el ticket:", error);
      throw error;
    }
  },
};

export default apiService;
