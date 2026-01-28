import api from './api';

const faqApi = {
    // Récupérer toutes les FAQs
    getAllFaqs: async () => {
        return api.get('/faqs?isAdmin=true');
    },

    // Créer une nouvelle FAQ
    createFaq: async (faqData) => {
        return api.post('/faqs', faqData);
    },

    // Mettre à jour une FAQ
    updateFaq: async (id, faqData) => {
        return api.put(`/faqs/${id}`, faqData);
    },

    // Supprimer une FAQ
    deleteFaq: async (id) => {
        return api.delete(`/faqs/${id}`);
    },
};

export default faqApi;
