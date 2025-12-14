/**
 * Point d'entrée unique pour les données des stands
 * 
 * Pour changer d'année :
 * 1. Importer le nouveau fichier stands_XXXX.js
 * 2. L'ajouter dans STANDS_BY_YEAR
 * 3. Mettre à jour CURRENT_YEAR
 */

import stands2025 from './stands_2025';

// Mapping année -> données
export const STANDS_BY_YEAR = {
    2025: stands2025,
    // 2026: stands2026, // À ajouter l'année prochaine
};

// Année courante (à changer chaque année)
export const CURRENT_YEAR = 2025;

// Export des stands de l'année en cours (utilisé par les composants)
export const standsCurrent = STANDS_BY_YEAR[CURRENT_YEAR];

// Export de toutes les années disponibles (utile pour debug/historique)
export const availableYears = Object.keys(STANDS_BY_YEAR).map(Number);
