import axios from "axios";

// --- CONFIGURATION DIRECTE ---
const IP_IPHONE = "172.20.10.3"; 
const API_URL = `http://${IP_IPHONE}:5000/api`;

console.log("Tentative de connexion sur :", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

export const offerService = {
  getOffers: async () => {
    try {
      // TESTER LES DEUX : 
      // Si tu as une erreur 404, essaie de retirer "/admin"
      const response = await api.get("/admin/offers"); 
      
      console.log("Données reçues du serveur");
      return response.data.data || response.data;
    } catch (error) {
      if (error.response) {
        // Le serveur a répondu avec un code (404, 401, 500)
        console.log(" Erreur Serveur:", error.response.status);
      } else {
        // Problème de réseau (Timeout)
        console.log(" Erreur Réseau (Vérifie ton IP ou Pare-feu)");
      }
      throw error;
    }
  }
};

export default api;
