# Guide de Test Complet - Plan Interactif Dynamique

## 🎯 Objectif
Vérifier que **backend**, **admin-web** et **myApp** fonctionnent correctement ensemble avant de pusher sur Git.

---

## ✅ Checklist Rapide

- [ ] Backend démarre sans erreur
- [ ] Base de données contient les tables nécessaires
- [ ] API endpoints répondent correctement
- [ ] Admin-web peut créer/modifier plans
- [ ] Admin-web peut importer CSV stands
- [ ] myApp fetch le plan actif
- [ ] myApp affiche plan et stands correctement
- [ ] Interactions myApp fonctionnent (click, recherche, liste)

---

## 📋 ÉTAPE 1 : Test Backend Seul

### 1.1 Démarrer Backend

```bash
cd backend
npm start
```

**Vérifications** :
- ✅ Aucune erreur de démarrage
- ✅ Message : `Server running on port 5000`
- ✅ Connexion DB réussie (pas d'erreur Sequelize)

**Erreurs Possibles** :
- ❌ "Cannot connect to database" → Vérifier PostgreSQL running + credentials `.env`
- ❌ "Port 5000 already in use" → Tuer processus ou changer port

---

### 1.2 Vérifier Tables DB

```sql
-- Ouvrir psql ou pgAdmin
\c amge_db

-- Vérifier tables existent
\dt

-- Doit afficher :
-- plan_versions
-- stands
-- companies
-- users
-- ... (autres tables existantes)

-- Vérifier structure Stand
\d stands

-- Doit avoir colonne "category"
```

**Alternative PowerShell** :
```powershell
psql -U postgres -d amge_db -c "\dt"
```

---

### 1.3 Tester Endpoints API (Postman ou cURL)

#### A. Lister Plans
```bash
curl http://localhost:5000/api/plans
```

**Réponse attendue** :
```json
{
  "success": true,
  "data": [...],
  "msg": "Plans récupérés avec succès"
}
```

#### B. Plan Actif (endpoint public)
```bash
curl http://localhost:5000/api/plans/active
```

**Réponse attendue** :
- Si plan actif existe : `{ "success": true, "data": { ... } }`
- Si aucun plan actif : `{ "success": false, "msg": "Aucun plan actif" }`

#### C. Avec Token (si routes protégées)
```bash
# Connexion admin d'abord
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amge.ma","password":"votre_password"}'

# Récupérer token dans réponse
# Puis utiliser token :
curl http://localhost:5000/api/plans \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## 📋 ÉTAPE 2 : Test Admin-Web

### 2.1 Démarrer Admin-Web

```bash
cd admin-web
npm run dev
```

**Vérifications** :
- ✅ Compile sans erreur
- ✅ Message : `Local: http://localhost:3001`
- ✅ Ouvrir navigateur → `http://localhost:3001`

---

### 2.2 Test Connexion

1. **Login** avec credentials admin
2. **Vérifier** : Redirection vers dashboard
3. **Vérifier** : Menu sidebar affiche "Plans Interactifs"

**Erreurs Possibles** :
- ❌ CORS error → Vérifier backend autorise origin `http://localhost:3001`
- ❌ Network error → Vérifier backend running + URL dans `admin-web/.env`

---

### 2.3 Test CRUD Plans

#### Créer Plan
1. Cliquer **"Plans Interactifs"** (sidebar)
2. Cliquer **"➕ Nouveau Plan"**
3. Remplir formulaire :
   - Année : `2025`
   - Largeur : `1725`
   - Hauteur : `1725`
4. Upload image test (n'importe quelle image PNG/JPG)
5. Cliquer **"Sauvegarder"**

**Vérifications** :
- ✅ Message succès
- ✅ Redirection vers liste plans
- ✅ Nouveau plan apparaît dans tableau

#### Modifier Plan
1. Cliquer icône **"✏️"** (éditer)
2. Changer année → `2026`
3. Sauvegarder

**Vérifications** :
- ✅ Modifications enregistrées
- ✅ Affichage mis à jour

---

### 2.4 Test Import CSV

#### Préparer CSV Test

Créer fichier `test_stands.csv` :
```csv
label,x,y,width,height,category,company_name
54,494.04,1176.97,51.92,70.03,Entreprise,MAROC TELECOM
Accueil,982.04,1269.95,190.96,76.07,Service,
55,495.07,1107.97,51.06,69.00,Entreprise,OCP
```

#### Importer
1. Dans liste plans, cliquer **"📍"** (Gérer stands)
2. Cliquer **"📥 Importer CSV"**
3. Glisser-déposer `test_stands.csv`
4. Vérifier preview :
   - **3 stands détectés** ✅
   - Premières lignes affichées
5. Cliquer **"✅ Importer"**

**Vérifications** :
- ✅ Message : "3 stands importés avec succès"
- ✅ Warnings si entreprise non trouvée (normal si DB vide)
- ✅ Liste stands affiche 3 items
- ✅ Colonne catégorie correcte (Entreprise, Service)

**Erreurs Possibles** :
- ❌ "Format CSV invalide" → Vérifier colonnes header
- ❌ "Dimensions plan manquantes" → S'assurer plan a imageWidth/Height

---

### 2.5 Test Visualisation Plan

1. Retour liste plans
2. Cliquer **"👁️"** (Visualiser)
3. **Vérifier** :
   - ✅ Image plan affichée
   - ✅ Rectangles SVG overlay positionnés
   - ✅ Click sur rectangle → modal avec infos stand
   - ✅ Statistique : "3 stands, X avec entreprise"

---

### 2.6 Test Activation Plan

1. Retour liste plans
2. Si plan pas actif, cliquer **"✅"** (Activer)
3. **Vérifier** :
   - ✅ Icône change (🟢)
   - ✅ Badge "Actif" affiché
   - ✅ Autres plans deviennent inactifs automatiquement

---

## 📋 ÉTAPE 3 : Test myApp

### 3.1 Configuration API

**Vérifier fichier** `myApp/config/api.config.js` :
```javascript
export default {
  dev: {
    apiUrl: 'http://localhost:5000/api',  // ✅ Pour test web
  }
};
```

**Si test sur mobile physique** :
```javascript
apiUrl: 'http://192.168.X.X:5000/api',  // IP de votre PC
```

---

### 3.2 Démarrer myApp

```bash
cd myApp
npm start
```

**Vérifications** :
- ✅ Metro bundler démarre
- ✅ QR code affiché (pour mobile)
- ✅ Option `› Press w │ open web` disponible

---

### 3.3 Test Version Web

1. **Dans terminal myApp**, presser **`w`**
2. Navigateur s'ouvre → `http://localhost:8081`
3. **Aller à l'écran Plan** (navigation menu)

**Vérifications Console (F12)** :
```
[InteractiveMap.web] Loading stands from API...
[PlanAPI] Fetching active plan from: http://localhost:5000/api/plans/active
[PlanAPI] Active plan fetched successfully
[PlanAPI] Transforming 3 stands for app
[PlanAPI] Stands with company: 2/3
[InteractiveMap.web] Loaded 3 stands from API
[InteractiveMap.web] Using stands from API (already enriched)
```

**Affichage Visuel** :
- ✅ Image plan chargée (pas d'erreur 404)
- ✅ Rectangles stands affichés (3 rectangles)
- ✅ Pas de spinner "loading" bloqué
- ✅ Pas d'erreur rouge

---

### 3.4 Test Interactions myApp

#### A. Click Stand
1. **Cliquer** sur rectangle stand "54"
2. **Vérifier** Bottom Sheet s'ouvre :
   - ✅ Nom entreprise : "MAROC TELECOM"
   - ✅ Stand numéro : "Stand 54"
   - ✅ Boutons : Visité, Favori
   - ✅ (Si URL site web) Bouton "🌐 Voir le site web"

3. **Cliquer** sur stand "Accueil"
4. **Vérifier** Bottom Sheet différent :
   - ✅ Nom : "Accueil"
   - ✅ Badge : "Type: Service" (pas d'entreprise)
   - ✅ PAS de message "Informations non disponibles"

#### B. Recherche
1. **Cliquer** barre recherche (haut écran)
2. **Taper** : "maroc"
3. **Vérifier** :
   - ✅ Suggestions affichées : "MAROC TELECOM"
   - ✅ Click suggestion → focus sur stand + bottom sheet

#### C. Liste Exposants
1. **Cliquer** bouton **"📋 Liste"** (en haut)
2. **Vérifier** modal liste :
   - ✅ 3 items affichés
   - ✅ Section "A" : Accueil
   - ✅ Section "M" : MAROC TELECOM
   - ✅ Section "O" : OCP
3. **Cliquer** un item liste
4. **Vérifier** :
   - ✅ Modal se ferme
   - ✅ Carte focus sur stand sélectionné
   - ✅ Bottom sheet s'ouvre

#### D. Zoom/Pan (Web)
1. **Scroll molette** souris
2. **Vérifier** : Zoom in/out fonctionne
3. **Drag** avec souris
4. **Vérifier** : Pan fonctionne

---

### 3.5 Test Version Mobile (Optionnel)

1. **Scanner QR code** avec Expo Go (iOS/Android)
2. Attendre chargement app
3. **Répéter tests interactions** (3.4)

**Note** : Si test sur mobile physique, s'assurer :
- ✅ PC et mobile sur **même réseau WiFi**
- ✅ `api.config.js` utilise **IP du PC** (pas localhost)
- ✅ Firewall autorise port 5000

---

## 📋 ÉTAPE 4 : Test End-to-End Complet

### Scénario : Admin Crée Plan → User Voit dans App

1. **Admin-Web** : Créer nouveau plan année 2027
2. **Admin-Web** : Upload image différente
3. **Admin-Web** : Importer CSV avec 5 stands
4. **Admin-Web** : Activer ce plan 2027
5. **myApp (web)** : Recharger page (Ctrl+R)
6. **Vérifier** :
   - ✅ Nouveau plan 2027 chargé
   - ✅ 5 stands affichés
   - ✅ Image plan différente

**Résultat attendu** : Le plan actif dans admin est immédiatement visible dans myApp après refresh.

---

## 🐛 Dépannage Erreurs Courantes

### Backend

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Cannot connect to database` | PostgreSQL pas running | `pg_ctl start` ou démarrer service |
| `Column "category" does not exist` | Migration pas exécutée | Exécuter script migration SQL |
| `multer error` | Dossier uploads manquant | Créer `backend/uploads/plans/` |
| `Port 5000 already in use` | Processus déjà actif | `npx kill-port 5000` ou changer PORT |

### Admin-Web

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Network Error` | Backend pas running | Démarrer backend d'abord |
| `CORS error` | Backend CORS mal configuré | Vérifier `server.js` autorise origin |
| `404 routes /plans` | Routes pas configurées | Vérifier `Dashboard.jsx` a route `/plans/*` |
| Styles cassés | CSS pas importé | Vérifier imports `Plans.css` + `WorkflowHelp.css` |

### myApp

| Erreur | Cause | Solution |
|--------|-------|----------|
| `fetch failed` | Backend pas accessible | Vérifier URL dans `api.config.js` |
| Image plan 404 | URL image incorrecte | Vérifier `backend/uploads/` servi statiquement |
| Stands vides | API retourne vide | Vérifier plan actif existe + a stands |
| `undefined is not an object` | Structure data différente | Vérifier logs transformation dans `planApi.js` |

---

## ✅ Validation Finale

### Checklist Avant Push Git

- [ ] Backend démarre proprement (aucune erreur console)
- [ ] DB contient au moins 1 plan actif avec stands
- [ ] Admin-web affiche liste plans sans erreur
- [ ] Admin-web peut créer/modifier plan
- [ ] Admin-web peut importer CSV sans erreur
- [ ] Admin-web visualisation plan fonctionne
- [ ] myApp (web) charge plan actif sans erreur (vérifier F12 console)
- [ ] myApp affiche rectangles stands correctement
- [ ] myApp click stand ouvre bottom sheet avec infos
- [ ] myApp recherche fonctionne
- [ ] myApp liste exposants affiche tous stands
- [ ] Aucune erreur dans console backend
- [ ] Aucune erreur dans console navigateur (F12)
- [ ] Tests sur 2-3 plans différents (activation toggle fonctionne)

---

## 📸 Screenshots Recommandés

Avant de pusher, prenez screenshots pour documentation :
1. Admin-web : Liste plans
2. Admin-web : Formulaire plan
3. Admin-web : Import CSV (preview)
4. Admin-web : Visualisation plan
5. myApp : Plan avec stands
6. myApp : Bottom sheet entreprise
7. myApp : Bottom sheet service
8. myApp : Liste exposants

---

## 🚀 Si Tous les Tests Passent

**Vous êtes prêt à commit et push !**

Suivez le guide Git commit pour les commandes exactes.

---

**Dernière mise à jour** : 14 Décembre 2024
