import { api } from '../utils/api';

export const fetchFaqs = async () => {
    try {
        const response = await api.get('/faqs');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des FAQ:', error);
        throw error;
    }
};
