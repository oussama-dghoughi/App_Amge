# Plan Interactif Dynamique - Documentation Complète

## 🎯 Vue d'Ensemble

Cette branche implémente la **migration complète du plan interactif vers une architecture dynamique basée sur une API**. Les données de plans et stands ne sont plus hardcodées mais gérées via une interface d'administration (admin-web) et servies par une API REST (backend).

### Résumé Exécutif

| Avant | Après |
|-------|-------|
| Plan statique hardcodé dans le code | Plan dynamique géré via admin-web |
| Modification du code pour chaque changement | Interface CRUD complète pour admins |
| Un seul plan possible | Multi-plans avec activation |
| Pas de catégories stands | Support 4 catégories (Entreprise, Service, Salle, Restauration) |
| Association entreprises manuelle | Auto-matching lors import CSV |

---

## 📂 Structure du Projet

```
App_Amge_back/
├── admin-web/          # Interface d'administration React
├── backend/            # API REST Node.js + Express + PostgreSQL
├── myApp/              # Application mobile React Native + Expo
└── README.md           # Ce fichier
```

---

## 🔧 Changements par Composant

### 1. **Backend** (`backend/`)

#### Nouveaux Fichiers

| Fichier | Description |
|---------|-------------|
| `models/PlanVersion.js` | Modèle Sequelize - Table `plan_versions` |
| `models/Stand.js` | Modèle Sequelize - Table `stands` (+ colonne `category`) |
| `models/index.js` | Export centralisé des modèles + associations |
| `controllers/planController.js` | Logique métier plans (CRUD, upload, CSV import, activation) |
| `routes/planRoutes.js` | Routes API `/api/plans/*` |
| `routes/standRoutes.js` | Routes API `/api/stands/*` (si utilisé) |
| `migrations/add_category_to_stands.sql` | Script SQL migration colonne `category` |
| `migrate_add_category.js` | Script Node.js pour migration |
| `uploads/` | Dossier stockage images plans et fichiers uploadés |

#### Fichiers Modifiés

| Fichier | Changements |
|---------|-------------|
| `server.js` | + Import routes plans, + Serve static `/uploads` |
| `config/database.js` | Configuration Sequelize + sync models |
| `package.json` | + Dependencies (multer, papaparse si manquant) |
| `controllers/companyController.js` | Potentiellement ajusté pour association stands |

#### Fonctionnalités Ajoutées

✅ **CRUD Plans Complet**
- `POST /api/plans` - Créer plan
- `GET /api/plans` - Lister tous plans
- `GET /api/plans/:id` - Détails plan
- `PATCH /api/plans/:id` - Modifier plan
- `DELETE /api/plans/:id` - Supprimer plan (si non actif)
- `PATCH /api/plans/:id/activate` - Activer plan (désactive les autres)

✅ **Upload & Import**
- `POST /api/plans/:id/upload-image` - Upload image plan (multer)
- `POST /api/plans/:id/import-csv` - Import stands depuis CSV

✅ **Endpoint Public**
- `GET /api/plans/active` - Récupère plan actif + stands enrichis (pour myApp)

✅ **Support Catégories**
- Parsing colonne `category` du CSV
- Matching conditionnel : entreprise cherchée UNIQUEMENT si `category = 'Entreprise'`
- Autres catégories (Service, Salle, Restauration) créées sans entreprise

---

### 2. **Admin-Web** (`admin-web/`)

#### Nouveaux Fichiers

**Module Plans Complet** (`src/components/Plans/`)

| Fichier | Description |
|---------|-------------|
| `Plans.jsx` | Composant wrapper + routing `/plans/*` |
| `PlanList.jsx` | Liste plans + actions (activer, modifier, gérer stands, supprimer) + **Guide Workflow** |
| `PlanForm.jsx` | Formulaire création/édition + upload image avec preview |
| `StandManager.jsx` | Gestion stands d'un plan (liste, import CSV, suppression) |
| `CsvImporter.jsx` | Composant import CSV (drag-and-drop, preview, validation) |
| `PlanViewer.jsx` | Visualisation plan avec overlay rectangles stands cliquables |
| `Plans.css` | Styles complets du module Plans |
| `WorkflowHelp.css` | Styles section d'aide workflow (6 étapes VGG→CSV) |

#### Fichiers Modifiés

| Fichier | Changements |
|---------|-------------|
| `src/components/Dashboard/Sidebar.jsx` | + Item menu "Plans Interactifs" |
| `src/components/Dashboard/Dashboard.jsx` | + Route `/plans/*` vers module Plans |
| `package.json` | Vérification dependencies React Router |

#### Fonctionnalités Interface Admin

✅ **Gestion Plans**
- Tableau liste plans : année, dimensions, actif, nb stands, actions
- Formulaire création : année, upload image, dimensions (px)
- Activation toggle (1 seul actif)
- Suppression (si non actif et pas dernier)

✅ **Gestion Stands**
- Liste stands d'un plan (tableau : numéro, catégorie, entreprise, actions)
- Import CSV avec :
  - Drag-and-drop ou file picker
  - Preview 5 premières lignes
  - Compteur stands détectés
  - Upload + parsing backend
  - Retour erreurs/warnings ligne par ligne
- Suppression tous stands (avec confirmation)

✅ **Visualisation Plan**
- Affichage image plan
- Overlay SVG avec rectangles stands (positions %)
- Click stand → modal infos (numéro, catégorie, entreprise associée)
- Statistiques : X stands, Y avec entreprise

✅ **Guide Workflow Intégré**
- 6 étapes détaillées (affiché en bas de PlanList) :
  1. Préparer image plan
  2. Créer plan interface
  3. Extraire positions VGG/manuel
  4. Préparer CSV (format + catégories)
  5. Importer stands
  6. Vérifier et activer
- Conseils & astuces (4 cards tips)
- Warnings (points d'attention)

---

### 3. **myApp** (`myApp/`)

#### Nouveaux Fichiers

**Configuration & Services**

| Fichier | Description |
|---------|-------------|
| `config/api.config.js` | Config URLs API (dev: localhost, prod: TBD) |
| `services/planApi.js` | Service layer - `fetchActivePlan()` + `transformStandsForApp()` |

**Composants Plan Module**

| Fichier | Description |
|---------|-------------|
| `components/PlanModule/InteractiveMap.native.js` | Carte interactive React Native (ZoomableView) |
| `components/PlanModule/InteractiveMap.web.js` | Carte interactive Web (ScrollView) |
| `components/PlanModule/StandBottomSheet.js` | Détails stand avec différenciation catégorie |
| `components/PlanModule/ExhibitorsList.js` | Liste alphabétique ALL stands (pas que entreprises) |
| `components/PlanModule/StandRect.js` | Rectangle cliquable stand |
| `components/PlanModule/SearchBar.js` | Barre recherche stands |
| `components/PlanModule/enrichUtils.js` | (déprécié - enrichissement fait côté backend) |
| `components/PlanModule/searchUtils.js` | Utilitaires recherche/normalisation |
| `components/PlanModule/planConfig.js` | Config (ratio plan) |

**Données**

| Fichier | Description |
|---------|-------------|
| `data/stands_2025.js` | **Conservé pour référence** (non utilisé par l'app) |
| `data/standsIndex.js` | Index exports (potentiellement déprécié) |
| `assets/maps/` | Dossier images plans (peut être vide si fetch API) |

**Scripts** (nouveaux)

| Fichier | Description |
|---------|-------------|
| `scripts/convert_plan.py` | Script Python conversion VGG JSON → CSV (utilitaire) |

#### Fichiers Modifiés

| Fichier | Changements |
|---------|-------------|
| `Screen/PlanScreen.js` | Import InteractiveMap (platform specific) |
| `App.js` | Potentiellement navigation vers PlanScreen |
| `package.json` | Vérification dependencies |
| `app.json` | Config Expo (pas de changement majeur) |

#### Fichiers Supprimés

| Fichier | Raison |
|---------|--------|
| `webpack.config.js` | Déplacé ou config obsolète |

#### Fonctionnalités myApp

✅ **Fetch Dynamique API**
- Appel `GET /api/plans/active` au mount composant
- Loading state (spinner) pendant fetch
- Error handling (message + retry)
- Transformation data au format app (% déjà calculés côté backend)

✅ **Affichage Différencié Catégories**
- **Stand Entreprise avec company** :
  - Nom entreprise
  - Stand numéro
  - Secteur
  - Description
  - Bouton site web (si URL)
  - Boutons favoris/visité
  
- **Stand Entreprise SANS company** :
  - Numéro stand
  - Message "Informations non disponibles"
  - Boutons favoris/visité

- **Stand Service/Salle/Restauration** :
  - Nom stand (ex: "Accueil", "Salle A")
  - Badge catégorie (Type: Service)
  - Boutons favoris/visité
  - PAS de message "non disponible" (normal sans entreprise)

✅ **Liste Exposants Complète**
- Inclut TOUS les stands (pas uniquement entreprises)
- Groupement alphabétique par nom entreprise OU numéro stand
- Recherche filtrée
- Click → focus sur carte + ouverture bottom sheet

---

## 🗄️ Base de Données

### Nouvelles Tables

#### `plan_versions`

```sql
CREATE TABLE plan_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  imageUrl VARCHAR(500),
  imageWidth INTEGER NOT NULL,
  imageHeight INTEGER NOT NULL,
  isActive BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Contrainte** : Un seul plan avec `isActive = TRUE` à la fois.

#### `stands` (modifiée)

```sql
CREATE TABLE stands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  standNumber VARCHAR(50) NOT NULL,
  xPercent DECIMAL(8,4) NOT NULL,  -- 0-100
  yPercent DECIMAL(8,4) NOT NULL,  -- 0-100
  wPercent DECIMAL(8,4) NOT NULL,  -- 0-100
  hPercent DECIMAL(8,4) NOT NULL,  -- 0-100
  category VARCHAR(50) DEFAULT 'Entreprise',  -- NOUVEAU
  planVersionId UUID REFERENCES plan_versions(id) ON DELETE CASCADE,
  companyId UUID REFERENCES companies(id) ON DELETE SET NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Migration** : Colonne `category` ajoutée via script `migrate_add_category.js`.

### Relations

- `Stand belongsTo PlanVersion` (N:1, cascade delete)
- `Stand belongsTo Company` (N:1, nullable, set null on delete)
- `PlanVersion hasMany Stand` (1:N)

---

## 📥 Format CSV Import

### Structure Attendue

```csv
label,x,y,width,height,category,company_name
54,494.04,1176.97,51.92,70.03,Entreprise,MAROC TELECOM
Accueil,982.04,1269.95,190.96,76.07,Service,
Toilettes H,400.00,100.00,40.00,50.00,Service,
Salle A,500.00,200.00,150.00,120.00,Salle,
55,495.07,1107.97,51.06,69.00,Entreprise,OCP
```

### Colonnes

| Colonne | Obligatoire | Description |
|---------|-------------|-------------|
| `label` | ✅ | Numéro ou nom stand |
| `x` | ✅ | Position X (pixels) |
| `y` | ✅ | Position Y (pixels) |
| `width` | ✅ | Largeur (pixels) |
| `height` | ✅ | Hauteur (pixels) |
| `category` | ❌ | Type : Entreprise, Service, Salle, Restauration (défaut: Entreprise) |
| `company_name` | ❌ | Nom entreprise (matching auto si `category=Entreprise`) |

### Traitement Backend

1. **Parse CSV** (papaparse)
2. **Validation** : champs requis, types, valeurs
3. **Conversion** : pixels → pourcentages (basé sur `imageWidth/Height` du plan)
4. **Matching entreprise** :
   - SI `category = 'Entreprise'` ET `company_name` fourni
   - Recherche case-insensitive normalisée dans table `companies`
   - Si trouvé → `companyId` assigné
   - Si pas trouvé → warning retourné
5. **Bulk insert** : `Stand.bulkCreate()`

---

## 🚀 Workflow Admin Complet

### Étape 1 : Préparer Image Plan
- Format : PNG ou JPG
- Notez dimensions exactes (ex: 1725 × 1725 px)
- Image claire avec numéros stands visibles

### Étape 2 : Créer Plan (admin-web)
1. `/plans` → "Nouveau Plan"
2. Année : 2025
3. Upload image
4. Dimensions : largeur + hauteur (pixels)
5. Sauvegarder

### Étape 3 : Extraire Positions Stands

**Option A - VGG Image Annotator**
1. Ouvrir image dans VGG (http://www.robots.ox.ac.uk/~vgg/software/via/)
2. Dessiner rectangles autour stands
3. Exporter JSON
4. Utiliser script `myApp/scripts/convert_plan.py` pour convertir JSON → CSV

**Option B - Mesure Manuelle**
1. Ouvrir image dans éditeur (Photoshop, GIMP)
2. Outil sélection rectangulaire sur chaque stand
3. Noter : X, Y, Width, Height
4. Créer CSV manuellement

### Étape 4 : Préparer CSV
- Créer fichier avec colonnes requises
- Ajouter `category` pour différencier types stands
- Ajouter `company_name` pour stands Entreprise

### Étape 5 : Importer (admin-web)
1. Plans → Gérer Stands (icône 📍)
2. Import CSV
3. Drag-and-drop fichier
4. Vérifier preview
5. Importer
6. Consulter warnings (entreprises non trouvées)

### Étape 6 : Vérifier et Activer
1. Visualiser plan (icône 👁️)
2. Vérifier positions rectangles
3. Tester clicks → infos stands
4. Retour liste → Activer (✅)

### Étape 7 : Tester myApp
1. Relancer app mobile/web
2. Vérifier fetch API réussit
3. Tester interactions (zoom, click, recherche, liste)

---

## 🔧 Configuration Requise

### Backend `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/amge_db
PORT=5000
NODE_ENV=development
UPLOAD_DIR=./uploads
JWT_SECRET=your_jwt_secret_here
```

### myApp `config/api.config.js`

```javascript
export default {
  dev: {
    apiUrl: 'http://localhost:5000/api',      // Web testing
    // apiUrl: 'http://192.168.x.x:5000/api', // Mobile device testing
  },
  prod: {
    apiUrl: 'https://your-production-api.com/api'
  }
};
```

**Note** : Pour tester sur mobile physique, utiliser l'IP de votre PC (pas localhost).

---

## 🗑️ Fichiers à Supprimer (Temporaires/Test)

### Backend
- ✅ `migrate_add_category.js` - Migration déjà exécutée, garder pour référence OU supprimer
- ✅ `env.example.txt` - Déjà supprimé (remplacé par .env.example standard)

### myApp
- ✅ `webpack.config.js` - Déjà supprimé (config obsolète)
- ⚠️ `scripts/` - **À VÉRIFIER** : contient `convert_plan.py` utile → **GARDER**
- ⚠️ `data/stands_2025.js` - Conservé pour référence (non utilisé) → **GARDER pour rollback potentiel**

### Admin-Web
- Aucun fichier temporaire identifié

### Racine Projet
- Aucun fichier temporaire

---

## ✅ Cette documentation comprend :
1. Vue d'ensemble et objectifs
2. Changements détaillés par composant (backend, admin-web, myApp)
3. Schéma base de données
4. Format CSV et traitement
5. Workflow admin complet étape par étape
6. Configuration requise
7. Liste fichiers à supprimer

Pour toute question technique, se référer aux commentaires dans le code ou aux guides intégrés dans admin-web.

**Dernière mise à jour** : 14 Décembre 2024  
**Branche** : `Plan_integration`
