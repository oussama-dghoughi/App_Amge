/**
 * Configuration du plan interactif
 * 
 * IMPORTANT : Si vous changez l'image du plan, mettez à jour ces dimensions !
 * 
 * Pour trouver les dimensions de votre image :
 * - Sur Mac : cmd+i sur le fichier
 * - Sur Windows : clic droit > Propriétés > Détails
 * - En ligne : https://www.metadata2go.com/
 */

// Dimensions réelles de l'image PLAN.png (en pixels)
export const PLAN_WIDTH = 1725;
export const PLAN_HEIGHT = 1725;

// Ratio calculé automatiquement (ne pas modifier manuellement)
export const PLAN_RATIO = PLAN_WIDTH / PLAN_HEIGHT;

// Métadonnées (optionnel, pour documentation)
export const PLAN_INFO = {
    filename: 'PLAN.png',
    year: 2025,
    format: 'PNG',
    lastUpdated: '2025-01-23',
};
