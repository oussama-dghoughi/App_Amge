-- Migration : Ajouter colonne category à la table stands
-- Exécuter cette requête dans PostgreSQL

ALTER TABLE stands 
ADD COLUMN category VARCHAR(50) DEFAULT 'Entreprise';

-- Vérifier
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'stands' AND column_name = 'category';
