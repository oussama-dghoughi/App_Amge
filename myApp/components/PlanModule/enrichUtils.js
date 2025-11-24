/**
 * Utilitaires pour enrichir les stands avec les données des entreprises
 */

import { normalize } from './searchUtils';
import { companies } from '../../data/companies';

/**
 * Mapping manuel pour les cas problématiques
 * Format: "NOM_DANS_STAND" → "NOM_DANS_COMPANIES"
 */
const MANUAL_MAPPING = {
    'MARJANE GROUP': 'MARJANE Holding',
    'L\'OREAL MAROC': 'L\'Oréal Morocco',
    'GROUPE CDG': 'CDG',
    'OCP GROUP': 'OCP',
    'LAFARGEHOLCIM MAROC': 'LafargeHolcim Maroc',
    'PHARMA 5': 'PHARMA 5',
    // Ajoutez d'autres mappings ici au besoin
};

/**
 * Construit un map nom normalisé → company
 * Pour lookup rapide O(1)
 */
export const buildCompaniesMap = (companiesList) => {
    const map = {};
    companiesList.forEach((company) => {
        const normalizedName = normalize(company.name);
        map[normalizedName] = company;
    });
    return map;
};

/**
 * Enrichit un stand avec les données de l'entreprise
 * 
 * Logique de matching :
 * 1. Manual mapping (priorité absolue)
 * 2. Exact match normalisé
 * 3. Fuzzy match (si unique et safe)
 * 
 * @param {Object} stand - Stand à enrichir
 * @param {Array} companiesList - Liste complète des companies
 * @param {Object} companiesMap - Map nom normalisé → company
 * @returns {Object} Stand enrichi avec companyDetails
 */
export const enrichStand = (stand, companiesList, companiesMap) => {
    if (!stand || !stand.company_name) {
        return { ...stand, companyDetails: null };
    }

    const standName = stand.company_name;
    const normalizedStandName = normalize(standName);
    let company = null;

    // 1. Manual mapping (priorité)
    if (MANUAL_MAPPING[standName]) {
        const mappedName = MANUAL_MAPPING[standName];
        const normalizedMappedName = normalize(mappedName);
        company = companiesMap[normalizedMappedName];

        if (company) {
            console.log(`[Enrich] Manual match: "${standName}" → "${company.name}"`);
        }
    }

    // 2. Exact match
    if (!company) {
        company = companiesMap[normalizedStandName];

        if (company) {
            console.log(`[Enrich] Exact match: "${standName}" → "${company.name}"`);
        }
    }

    // 3. Fuzzy match (safe)
    if (!company) {
        const candidates = companiesList.filter((c) => {
            const normalizedCompanyName = normalize(c.name);

            // Éviter les matches trop courts (< 4 chars)
            if (normalizedStandName.length < 4 || normalizedCompanyName.length < 4) {
                return false;
            }

            // Bidirectionnel : stand contient company OU company contient stand
            return (
                normalizedStandName.includes(normalizedCompanyName) ||
                normalizedCompanyName.includes(normalizedStandName)
            );
        });

        // Uniquement si UN SEUL candidat clair
        if (candidates.length === 1) {
            company = candidates[0];
            console.log(`[Enrich] Fuzzy match: "${standName}" → "${company.name}"`);
        } else if (candidates.length > 1) {
            console.warn(`[Enrich] Multiple fuzzy candidates for "${standName}":`,
                candidates.map(c => c.name).join(', '));
        }
    }

    // 4. Log si aucun match
    if (!company) {
        console.log(`[Enrich] NO MATCH: "${standName}"`);
    }

    return {
        ...stand,
        companyDetails: company || null,
    };
};

/**
 * Enrichit tous les stands
 */
export const enrichAllStands = (stands) => {
    const companiesMap = buildCompaniesMap(companies);
    return stands.map((stand) => enrichStand(stand, companies, companiesMap));
};
