import axios from "axios";

const BASE_URL = "http://localhost:5000"; // URL del servidor JSON
const LOCAL_STORAGE_KEY = "tickets"; // Clave para almacenar los tickets en localStorage

const apiService = {
  /**
   * Obtener todos los tickets
   * @returns {Promise<Array>} Lista de tickets
   */
  getAll: async () => {
    try {
      // Verificar si los datos están en localStorage
      const cachedTickets = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cachedTickets) {
        return JSON.parse(cachedTickets);
      }

      // Si no están en localStorage, obtenerlos del servidor
      const response = await axios.get(`${BASE_URL}/tickets`);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(response.data)); // Guardar en localStorage
      return response.data;
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
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
      const response = await axios.post(`${BASE_URL}/tickets`, ticketData);

      // Actualizar localStorage
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
   * @param {number} id - ID del ticket a eliminar
   * @returns {Promise<void>} Confirmación de eliminación
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
   * @param {number} id - ID del ticket a actualizar
   * @param {Object} ticketData - Datos actualizados del ticket
   * @returns {Promise<Object>} Ticket actualizado
   */
  update: async (id, ticketData) => {
    try {
      const response = await axios.put(`${BASE_URL}/tickets/${id}`, ticketData);

      // Actualizar localStorage
      const cachedTickets =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      const updatedTickets = cachedTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, ...ticketData } : ticket
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
