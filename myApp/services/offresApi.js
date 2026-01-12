import axios from "axios";

// --- CONFIGURATION DIRECTE ---
const IP_IPHONE = "localhost"; 
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
      const response = await api.get("/offers"); 
      
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