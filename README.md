# Plan Interactif Dynamique - Documentation Complète

## 🎯 Vue d'Ensemble

Cette branche implémente la **migration complète du plan interactif vers une architecture dynamique basée sur une API**, permettant la gestion des plans et stands via une interface d'administration.

### Résumé des Changements

| Aspect | Avant | Après |
|--------|-------|-------|
| **Source données** | Fichiers JS hardcodés | API REST dynamique |
| **Gestion plans** | Modification code source | Interface admin complète |
| **Catégories stands** | Non supportées | Entreprise, Service, Salle, Restauration |
| **Association entreprises** | Manuelle dans code | Auto-matching lors import CSV |
| **Activation plans** | Un seul plan | Multi-plans avec activation |

---

## 🏗️ Architecture Technique

```
┌─────────────────┐
│   Admin-Web     │ ← Interface gestion (React)
│ (localhost:3001)│
└────────┬────────┘
         │ POST/PUT/DELETE /api/plans
         ▼
┌─────────────────┐
│    Backend      │ ← API REST (Node.js + Express)
│ (localhost:5000)│
└────────┬────────┘
         │ Sequelize ORM
         ▼
┌─────────────────┐
│   PostgreSQL    │ ← Base de données
│   (amge_db)     │
└─────────────────┘
         ▲
         │ GET /api/plans/active
┌────────┴────────┐
│     myApp       │ ← Application mobile (React Native + Expo)
│ (localhost:8081)│
└─────────────────┘
```

---

## 📦 Composants Modifiés/Ajoutés

### Backend (`backend/`)
- ✅ **Nouveaux modèles** : `PlanVersion.js`, `Stand.js` (avec colonne `category`)
- ✅ **Nouveaux controllers** : `planController.js` (CRUD, upload, CSV import)
- ✅ **Nouvelles routes** : `planRoutes.js`, `standRoutes.js`
- ✅ **Migration DB** : `migrations/add_category_to_stands.sql`
- ✅ **Config modifiée** : `server.js`, `database.js`

### Admin-Web (`admin-web/`)
- ✅ **Module Plans complet** : 7 composants React
  - `PlanList.jsx` - Liste + actions
  - `PlanForm.jsx` - Création/édition + upload
  - `StandManager.jsx` - Gestion stands
  - `CsvImporter.jsx` - Import CSV drag-and-drop
  - `PlanViewer.jsx` - Visualisation interactive
  - `Plans.css` + `WorkflowHelp.css` - Styles
- ✅ **Dashboard modifié** : Routing + menu sidebar

### myApp (`myApp/`)
- ✅ **Service API** : `services/planApi.js`, `config/api.config.js`
- ✅ **Carte interactive** : Module `components/PlanModule/` complet
- ✅ **Support catégories** : Affichage différencié selon type stand
- ✅ **Indicateurs visuels** : Vert (visité), Jaune (favori)

---

## 🚀 Installation et Lancement

### Prérequis

- **Node.js** : v16+ 
- **PostgreSQL** : v12+
- **npm** ou **yarn**

### 1️⃣ Installation Backend

```bash
cd backend

# Installer dépendances
npm install

# Configurer .env
cp .env.example .env
# Éditer .env avec vos credentials DB :
# DATABASE_URL=postgresql://user:password@localhost:5432/amge_db
# PORT=5000

# Créer base de données
psql -U postgres -c "CREATE DATABASE amge_db;"

# Migration : Ajouter colonne category
psql -U postgres -d amge_db -f migrations/add_category_to_stands.sql
# OU
node -e "require('./config/database').sequelize.query('ALTER TABLE stands ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT \\'Entreprise\\';')"

# Lancer serveur
npm start
```

**Vérification** :
- ✅ Console : `Server running on port 5000`
- ✅ Test : `curl http://localhost:5000/api/plans/active`

---

### 2️⃣ Installation Admin-Web

```bash
cd admin-web

# Installer dépendances
npm install

# Lancer interface (dev mode)
npm run dev
```

**Accès** : `http://localhost:3001`

**Login** : Identifiants admin configurés dans votre DB

**Vérification** :
- ✅ Menu "Plans Interactifs" visible
- ✅ Aucune erreur console (F12)

---

### 3️⃣ Installation myApp

```bash
cd myApp

# Installer dépendances
npm install

# Configurer API URL (fichier déjà créé)
# Vérifier myApp/config/api.config.js :
# - Pour web : http://localhost:5000/api
# - Pour mobile : http://[VOTRE_IP]:5000/api

# Lancer app
npm start
```

**Options** :
- Presser **`w`** → Ouvrir version web (`http://localhost:8081`)
- Scanner **QR code** → Tester sur mobile (Expo Go)

**Vérification** :
- ✅ Plan charge (pas de spinner bloqué)
- ✅ Console F12 : `Loaded X stands from API`
- ✅ Click stand → bottom sheet s'ouvre

---

## 🧪 Guide de Test Complet

### Test 1 : Workflow Admin → myApp (End-to-End)

**Dans Admin-Web** :

1. **Créer plan** :
   ```
   Plans → Nouveau Plan
   - Année : 2025
   - Upload image (ex: plan PNG)
   - Largeur : 1725, Hauteur : 1725
   → Sauvegarder
   ```

2. **Importer stands via CSV** :
   
   Créer fichier `test_stands.csv` :
   ```csv
   label,x,y,width,height,category,company_name
   54,494.04,1176.97,51.92,70.03,Entreprise,MAROC TELECOM
   Accueil,982.04,1269.95,190.96,76.07,Service,
   55,495.07,1107.97,51.06,69.00,Entreprise,OCP
   ```
   
   ```
   Gérer Stands (📍) → Importer CSV
   → Glisser test_stands.csv
   → Vérifier : "3 stands détectés"
   → Importer
   ```

3. **Visualiser** :
   ```
   Visualiser (👁️)
   → Vérifier rectangles positionnés
   → Click stand → Voir infos
   ```

4. **Activer plan** :
   ```
   Retour liste → Activer (✅)
   → Plan devient actif (🟢)
   ```

**Dans myApp (web)** :

5. **Recharger page** (Ctrl+R)

6. **Vérifier** :
   - ✅ 3 rectangles stands affichés
   - ✅ Click stand 54 → "MAROC TELECOM" affiché
   - ✅ Click "Accueil" → Badge "Type: Service"

7. **Tester interactions** :
   - Click "Marquer comme visité" → Stand devient **VERT** 🟢
   - Click "Ajouter aux favoris" → Stand devient **JAUNE** 🟡
   - Recherche : Taper "maroc" → Suggestions
   - Liste (📋) → Voir 3 stands

**✅ Si tout fonctionne → Workflow validé !**

---

### Test 2 : Catégories Stands

**Tester affichage différencié** :

| Catégorie | Click stand | Affichage attendu |
|-----------|-------------|-------------------|
| **Entreprise** (avec company) | Stand 54 | Nom entreprise + secteur + site web |
| **Entreprise** (sans company) | Stand 99 | Numéro + "Infos non disponibles" |
| **Service** | Accueil | Nom + Badge "Type: Service" |
| **Salle** | Salle A | Nom + Badge "Type: Salle" |

---

### Test 3 : Multi-Plans

1. Créer 2e plan (année 2026)
2. Importer stands différents
3. **Activer plan 2026** → Plan 2025 devient inactif
4. Recharger myApp → Affiche plan 2026

---

## 🗄️ Base de Données

### Migration Requise

**Ajout colonne `category` à table `stands`** :

```sql
-- Option 1 : Via psql
psql -U postgres -d amge_db -f backend/migrations/add_category_to_stands.sql

-- Option 2 : Manuel
ALTER TABLE stands 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Entreprise';
```

**Vérification** :
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'stands' AND column_name = 'category';
```

### Schéma Tables

**`plan_versions`** :
- `id` (UUID, PK)
- `year` (INTEGER) - Année plan
- `imageUrl` (VARCHAR) - URL image
- `imageWidth`, `imageHeight` (INTEGER) - Dimensions pixels
- `isActive` (BOOLEAN) - Un seul TRUE à la fois

**`stands`** :
- `id` (UUID, PK)
- `standNumber` (VARCHAR) - Numéro/nom
- `xPercent`, `yPercent`, `wPercent`, `hPercent` (DECIMAL) - Positions %
- `category` (VARCHAR) - **NOUVEAU** : Entreprise/Service/Salle/Restauration
- `planVersionId` (UUID, FK → plan_versions)
- `companyId` (UUID, FK → companies, nullable)

---

## 📥 Format CSV Import

### Structure

```csv
label,x,y,width,height,category,company_name
```

**Colonnes** :
- `label` ✅ **Obligatoire** : Numéro ou nom stand
- `x, y, width, height` ✅ **Obligatoire** : Coordonnées en **pixels**
- `category` ⚠️ **Optionnel** : Entreprise (défaut), Service, Salle, Restauration
- `company_name` ⚠️ **Optionnel** : Nom entreprise (matching auto si trouvé)

**Traitement automatique** :
- Conversion pixels → pourcentages (basé sur dimensions plan)
- Matching entreprise case-insensitive (si `category = Entreprise`)
- Warnings pour entreprises non trouvées

### Exemples

**Stands mixtes** :
```csv
label,x,y,width,height,category,company_name
54,494.04,1176.97,51.92,70.03,Entreprise,MAROC TELECOM
Accueil,982.04,1269.95,190.96,76.07,Service,
Toilettes,400.00,100.00,40.00,50.00,Service,
Salle A,500.00,200.00,150.00,120.00,Salle,
Cafétéria,600.00,300.00,100.00,80.00,Restauration,
```

---

## ⚙️ Configuration

### Backend `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/amge_db
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
```

### myApp `config/api.config.js`

```javascript
export default {
  dev: {
    apiUrl: 'http://localhost:5000/api',      // Web
    // apiUrl: 'http://192.168.1.X:5000/api', // Mobile (remplacer X par votre IP)
  },
  prod: {
    apiUrl: 'https://your-backend.com/api'     // Production
  }
};
```

**Pour mobile** : Utiliser IP locale (même réseau WiFi), pas localhost

---

## ⚠️ Breaking Changes

### 1. myApp Nécessite Backend Running

**Avant** : App standalone avec données hardcodées  
**Après** : Requiert backend API accessible

**Impact** : Impossible de tester myApp sans backend

### 2. Migration DB Requise

**Action** : Exécuter script `migrations/add_category_to_stands.sql`

### 3. Format Données Modifié

**Avant** : `stands_2025.js` hardcodé  
**Après** : API retourne format enrichi avec `companyDetails`

---

## 🐛 Dépannage

### Erreur : "Cannot connect to database"

**Cause** : PostgreSQL pas running ou credentials incorrects

**Solution** :
```bash
# Windows
net start postgresql-x64-XX

# Vérifier connexion
psql -U postgres -d amge_db -c "SELECT 1;"
```

### Erreur : "Column category does not exist"

**Cause** : Migration pas exécutée

**Solution** :
```bash
cd backend
psql -U postgres -d amge_db -f migrations/add_category_to_stands.sql
```

### Erreur myApp : "fetch failed"

**Cause** : Backend pas accessible ou URL incorrecte

**Solution** :
1. Vérifier backend running : `curl http://localhost:5000/api/plans/active`
2. Vérifier `myApp/config/api.config.js` URL correcte
3. Si mobile : Utiliser IP locale, pas localhost

### Erreur Admin : "CORS error"

**Cause** : Backend pas configuré pour autoriser origin admin

**Solution** : Vérifier `backend/server.js` autorise `http://localhost:3001`

---

## 📚 Documentation Additionnelle

- **Guide test complet** : `backend/TEST_GUIDE.md`
- **Format CSV détaillé** : Section "Format CSV Import" ci-dessus
- **Workflow VGG→CSV** : Intégré dans admin-web (Plans → scroll bas)

---

## 🎯 Prochaines Étapes (Pour Merge)

### Checklist Avant Merge

- [ ] Tous tests passent (backend, admin-web, myApp)
- [ ] Migration DB documentée et testée
- [ ] Variables env configurées
- [ ] Breaking changes communiqués à l'équipe
- [ ] Documentation README complète ✅

### Merge vers Main

```bash
# Sur GitHub/GitLab
1. Créer Pull Request : Plan_integration → main
2. Review par team lead
3. Vérifier CI/CD (si configuré)
4. Merge avec squash (optionnel)
5. Déployer en staging pour tests équipe
```

---

## 👥 Support

**Questions techniques** : Voir commentaires dans code ou `TEST_GUIDE.md`

**Contact** : [Votre email/Slack]

---

## 📝 Changelog

### v2.0 - Dynamic Plan API (14 Dec 2024)

**Added** :
- Backend API complète (CRUD plans, CSV import, activation)
- Admin-web module Plans (7 composants)
- myApp migration API dynamique
- Support 4 catégories stands
- Indicateurs visuels (vert visité, jaune favori)
- Multi-plans avec activation
- Documentation complète (README + TEST_GUIDE)

**Changed** :
- myApp fetch data depuis API (plus hardcodé)
- Format données enrichi côté backend

**Removed** :
- Fichiers obsolètes (env.example.txt, webpack.config.js)

**Breaking** :
- myApp nécessite backend running
- Migration DB requise (colonne category)

---

**Date** : 14 Décembre 2024  
**Branche** : `Plan_integration`  
**Prêt pour merge** : ✅
