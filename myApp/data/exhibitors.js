export const exhibitors = {
  '41': {
    name: 'ACCURACY',
    coordinates: { x: 400, y: 300 },
    description: 'Cabinet de conseil indépendant'
  },
  '42': {
    name: 'ADS TECH - PART OF ACCENTURE',
    coordinates: { x: 450, y: 300 },
    description: 'Leader mondial du conseil et de la technologie'
  },
  '43': {
    name: 'ALLIANCES',
    coordinates: { x: 500, y: 300 },
    description: 'Groupe immobilier marocain'
  },
  '44': {
    name: 'AMGE - CARAVANE',
    coordinates: { x: 550, y: 300 },
    description: 'Association des Marocains aux Grandes Écoles'
  },
  '45': {
    name: 'ATTIJARIWAFA BANK',
    coordinates: { x: 600, y: 300 },
    description: 'Première banque marocaine'
  },
  // Ajoutez les autres entreprises selon le plan
};

export const planLayout = {
  // Définition des zones principales
  loungeClub: {
    x: 200,
    y: 100,
    width: 150,
    height: 150,
    label: 'LOUNGE CLUB - EXPOSANTS'
  },
  salleRepos: {
    x: 650,
    y: 250,
    width: 100,
    height: 80,
    label: 'SALLE DE REPOS'
  },
  accueil: {
    x: 400,
    y: 700,
    width: 200,
    height: 50,
    label: 'ACCUEIL'
  },
  // Définition des chemins (entrée, sortie)
  paths: {
    entree: 'M 800 750 L 800 800',
    sortie: 'M 200 750 L 200 800'
  }
}; 