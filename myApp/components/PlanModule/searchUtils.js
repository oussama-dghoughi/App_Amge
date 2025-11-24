/**
 * Utilitaires de recherche pour le plan interactif
 * 
 * Fonctionnalités :
 * - Normalisation (accents, casse, espaces)
 * - Filtrage intelligent (prefix/contains selon longueur query)
 */

/**
 * Normalise une chaîne pour la recherche
 * - Supprime les accents
 * - Convertit en minuscules
 * - Trim les espaces
 */
export const normalize = (str) => {
    if (!str) return '';

    return str
        .toLowerCase()
        .normalize('NFD') // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
        .trim();
};

/**
 * Filtre les stands selon la query
 * 
 * Logique :
 * - Query <= 2 chars : prefix match (commence par)
 * - Query > 2 chars : contains match (contient)
 * 
 * Tri des résultats :
 * - Priorité : startsWith > contains
 * - Alphabétique par nom
 */
export const filterStands = (stands, query) => {
    if (!query || query.trim() === '') {
        return [];
    }

    const normalizedQuery = normalize(query);
    const queryLength = normalizedQuery.length;

    // Filtrer
    const matches = stands.filter((stand) => {
        const normalizedName = normalize(stand.company_name);
        const normalizedStandNumber = normalize(stand.stand_number);

        // Recherche dans le nom ET le numéro de stand
        if (queryLength <= 2) {
            // Prefix match pour queries courtes
            return (
                normalizedName.startsWith(normalizedQuery) ||
                normalizedStandNumber.startsWith(normalizedQuery)
            );
        } else {
            // Contains match pour queries longues
            return (
                normalizedName.includes(normalizedQuery) ||
                normalizedStandNumber.includes(normalizedQuery)
            );
        }
    });

    // Trier : startsWith avant contains, puis alphabétique
    return matches.sort((a, b) => {
        const aName = normalize(a.company_name);
        const bName = normalize(b.company_name);

        const aStartsWith = aName.startsWith(normalizedQuery);
        const bStartsWith = bName.startsWith(normalizedQuery);

        // Priorité à ceux qui commencent par la query
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // Sinon tri alphabétique
        return aName.localeCompare(bName);
    });
};
