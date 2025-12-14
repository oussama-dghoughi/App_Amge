// Service API pour récupérer le plan actif
import config from '../config/api.config';

const API_URL = config.apiUrl;

export const fetchActivePlan = async () => {
    try {
        console.log('[PlanAPI] Fetching active plan from:', `${API_URL}/plans/active`);
        const response = await fetch(`${API_URL}/plans/active`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('[PlanAPI] Active plan fetched successfully');

        // DEBUG: Log la structure des données
        if (data.data && data.data.stands && data.data.stands.length > 0) {
            console.log('[PlanAPI] Sample raw stand from API:', data.data.stands[0]);
        }

        return data;
    } catch (error) {
        console.error('[PlanAPI] Error fetching active plan:', error);
        throw error;
    }
};

export const transformStandsForApp = (apiStands) => {
    console.log(`[PlanAPI] Transforming ${apiStands.length} stands for app`);

    const transformed = apiStands.map(stand => ({
        id: `stand-${stand.id}`,
        number: stand.number,  // ✅ API retourne déjà "number"
        company_name: stand.company_name || '',  // ✅ API retourne déjà "company_name"
        sector: stand.companyDetails?.sector || '',
        x: stand.x,  // ✅ API retourne déjà "x" (pas "xPercent")
        y: stand.y,  // ✅ API retourne déjà "y"
        w: stand.w,  // ✅ API retourne déjà "w"
        h: stand.h,  // ✅ API retourne déjà "h"
        shape_kind: 'rect',
        category: stand.category || 'Exposant',
        description: stand.company_name ? `Stand ${stand.number} - ${stand.company_name}` : `Stand ${stand.number}`,
        companyDetails: stand.companyDetails || null  // ✅ API retourne déjà "companyDetails"
    }));

    // Log pour debugger
    const withCompany = transformed.filter(s => s.company_name || s.companyDetails?.name);
    console.log(`[PlanAPI] Stands with company: ${withCompany.length}/${transformed.length}`);
    if (withCompany.length > 0) {
        console.log('[PlanAPI] Sample stand with company:', withCompany[0]);
    }

    return transformed;
};
