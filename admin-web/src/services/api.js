import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Créer une instance axios avec configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Services de gestion des utilisateurs
export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
  createUser: async (userData) => {
    const response = await api.post("/admin/users", userData);
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  toggleUserActive: async (id) => {
    const response = await api.patch(`/admin/users/${id}/toggle-active`);
    return response.data;
  },
};

// Services de gestion des événements
export const eventService = {
  getEvents: async (params = {}) => {
    const response = await api.get("/events", { params });
    return response.data;
  },
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

// Services de statistiques
export const statsService = {
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },
};

export const companyService = {
  getCompanies: () => api.get("/admin/companies").then((res) => res.data),
  getCompany: (id) => api.get(`/admin/companies/${id}`).then((res) => res.data),
  createCompany: (data) =>
    api.post("/admin/companies", data).then((res) => res.data),
  updateCompany: (id, data) =>
    api.put(`/admin/companies/${id}`, data).then((res) => res.data),
  deleteCompany: (id) =>
    api.delete(`/admin/companies/${id}`).then((res) => res.data),
};

export const offerService = {
  getOffers: () => api.get("/admin/offers").then((res) => res.data),
  getOffer: (id) => api.get(`/admin/offers/${id}`).then((res) => res.data),
  createOffer: (data) =>
    api.post("/admin/offers", data).then((res) => res.data),
  updateOffer: (id, data) =>
    api.put(`/admin/offers/${id}`, data).then((res) => res.data),
  deleteOffer: (id) =>
    api.delete(`/admin/offers/${id}`).then((res) => res.data),
};

export default api;
