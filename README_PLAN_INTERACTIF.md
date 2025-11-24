# Plan Interactif - Documentation Complète

## 1️⃣ Contexte & Objectifs

### Pourquoi remplacer le plan SVG statique ?

Le plan du Forum était un simple fichier SVG affiché en plein écran. Aucun zoom, pan, recherche ou interaction n'était possible. Le client souhaitait une expérience de type carte interactive (zoom‑pan, sélection de stands, affichage d'informations détaillées, recherche instantanée, annuaire complet).

### Objectifs UX

- **Navigation libre** : pinch‑to‑zoom, drag‑to‑pan (mobile) ou scroll‑wheel + drag (web)
- **Sélection de stand** : tap → highlight + bottom‑sheet avec les données de l'entreprise
- **Recherche live** : barre de recherche en haut, suggestions instantanées, focus automatique sur le stand trouvé
- **Annuaire alphabétique** : modal avec SectionList, filtrage intelligent, accès direct à un stand
- **Ouverture du site web** : lien fonctionnel sur web (window.open) et native (Linking.openURL)

### Contraintes

- L'app est déjà une Expo (React Native) multi‑plateforme (web + iOS + Android)
- Aucun impact sur les autres écrans : le module doit rester isolé dans `components/PlanModule/*`
- Maintenance annuelle : le plan évolue chaque année → nouveau fichier `stands_YYYY.js`

---

## 2️⃣ Résumé exécutif des changements

| Étape | Description | État actuel |
|-------|-------------|-------------|
| 1️⃣ Création du module de carte | `InteractiveMap.web.js` & `InteractiveMap.native.js` – wrapper autour du PNG du plan, affichage des StandRect | ✅ Produit fonctionnel (zoom/pan, sélection) |
| 2️⃣ Enrichissement des stands | `enrichUtils.js` + `searchUtils.js` : normalisation, mapping manuel, fuzzy matching, création d'un companiesMap | ✅ Données entreprises affichées dans bottom‑sheet |
| 3️⃣ Annuaire alphabétique | `ExhibitorsList.js` (modal, SectionList, recherche interne). Bouton flottant déplacé en haut (top: 80) | ✅ Liste filtrable, sélection → focus |
| 4A️⃣ Auto‑focus | Web : `focusOnStand` scroll doux vers le centre du stand. Native : zoomToLocation/moveTo (zoom = 2) via ReactNativeZoomableView | ✅ Focus fonctionnel depuis SearchBar et ExhibitorsList |
| 4B (Optionnel) | TODO : recentrer la vue depuis la liste (déjà prévu) | ⚙️ En cours (commenté) |
| 4C Website | Réactivation du bouton site web dans `StandBottomSheet` (validation d'URL, window.open / Linking) | ✅ Fonctionnel |

**Debug‑only :**
- `console.log` statements dans Enrichors, `focusOnStand`, `ExhibitorsList`
- Fallbacks (if (!ref) …) affichent des warnings mais n'interrompent pas l'app

**Prod‑ready :**
- Tous les composants sont importés depuis `components/PlanModule/*`
- Aucun fichier hors ce répertoire n'a été modifié (sauf `Screen/PlanScreen.js` qui importe le nouveau composant)

---

## 3️⃣ Architecture finale (arborescence)

```
myApp/
├─ assets/
│   └─ maps/
│        └─ PLAN.png                     ← image du plan (ratio 1.5)
├─ data/
│   ├─ companies.js                      ← tableau d'objets entreprise
│   ├─ exhibitors.js                     ← (non‑utilisé, présent)
│   ├─ stands_2025.js                    ← données brutes du plan 2025
│   ├─ stands_2025.json                  ← même data en JSON (pour référence)
│   └─ standsIndex.js                    ← exporte `standsCurrent` (importé)
├─ components/
│   └─ PlanModule/
│        ├─ ExhibitorsList.js            ← modal + SectionList + recherche
│        ├─ InteractiveMap.web.js        ← version web (ScrollView)
│        ├─ InteractiveMap.native.js     ← version native (ZoomableView)
│        ├─ SearchBar.js                 ← barre de recherche (déjà existante)
│        ├─ StandBottomSheet.js          ← affichage détaillé + site web
│        ├─ StandRect.js                 ← rectangle interactif du stand
│        ├─ enrichUtils.js               ← enrichStand / enrichAllStands
│        ├─ planConfig.js                ← `PLAN_RATIO` (fallback ratio)
│        └─ searchUtils.js               ← normalize, filterStands
├─ Screen/
│   └─ PlanScreen.js                     ← écran qui rend `<InteractiveMap/>`
└─ … (autres dossiers du projet)
```

| Symbole | Signification |
|---------|---------------|
| ✅ | Nouveau fichier |
| ✏️ | Modifié |
| 🗑️ | Supprimé |

---

## 4️⃣ Détails par fichier

### components/PlanModule/InteractiveMap.web.js

**Rôle :** Wrapper principal du plan pour le web.

**Exports :** default InteractiveMap.

**Props :** Aucun (utilise standsCurrent via import).

**Logique principale :**
- Charge le PNG, calcule le ratio (PLAN_RATIO)
- `standsEnriched = enrichAllStands(standsCurrent)` (memo)
- `searchResults = filterStands(standsEnriched, searchQuery)`
- `handleStandPress` → ouvre bottom‑sheet, désactive recherche
- `focusOnStand` → calcule le centre du stand en % → scroll animé (scrollViewRef.scrollTo)
- `handleSelectFromList` (appelée depuis `ExhibitorsList`) → ferme la liste, ouvre bottom‑sheet, focus via `focusOnStand`
- Bouton flottant déplacé en haut (top: 80)

**Choix technique :** useMemo pour éviter recalculs, scrollViewRef pour scroll doux, position_x/y exprimés en % du wrapper.

**Points d'attention / TODO :**
- console.log à nettoyer avant release
- Vérifier le comportement sur très grands écrans (ratio)

### components/PlanModule/InteractiveMap.native.js

**Rôle :** Version native (iOS/Android) du plan.

**Exports :** default InteractiveMap.

**Logique principale :**
- Charge l'image, calcule le ratio via Image.getSize
- `standsEnriched` memo idem
- `focusOnStand` utilise ReactNativeZoomableView : zoomToLocation (zoom = 2) ou moveTo
- `handleSelectFromList` → même logique que web, mais avec `focusOnStand` (zoom)
- Fallback (if (!zoomableViewRef.current)) → warning, pas de crash

**Choix technique :** ReactNativeZoomableView pour pinch‑zoom natif, useEffect pour charger le ratio.

**TODO :** Implémenter un fallback scroll‑translate si l'API n'est pas disponible (déjà commenté).

### components/PlanModule/StandRect.js

**Rôle :** Dessine un rectangle interactif au bon endroit du plan.

**Props :** position_x, position_y, stand_w, stand_h, isSelected, debug, onPress.

**Logique :** Position absolue via % (left: position_x%, top: position_y%).

**Pourquoi :** Séparer la logique de rendu du stand du composant carte.

### components/PlanModule/StandBottomSheet.js

**Rôle :** Modal (bottom‑sheet) affichant les infos détaillées du stand.

**Props :** stand, visible, onClose.

**Logique :**
- Si stand.companyDetails existe, montre name, field, details, bouton site web
- Site web : window.open(url, '_blank') (web) ou Linking.openURL(url) (native) avec protection if (!url)

**Points d'attention :** Vérifier que companyDetails.website est bien une URL valide.

### components/PlanModule/SearchBar.js

**Rôle :** Barre de recherche globale (déjà existante).

**Props :** query, onQueryChange, results, onResultSelect, showResults, onClearSearch.

**Logique :** Filtre via `filterStands` (déjà implémenté).

### components/PlanModule/ExhibitorsList.js

**Nouveau fichier.**

**Rôle :** Modal plein écran avec SectionList alphabétique.

**Props :** visible, onClose, standsEnriched, onSelectStand.

**Logique :**
- `searchQuery` state + TextInput
- `sections = useMemo` → filtre global (`normalize(name).includes(normalizedQuery)`) puis groupe par première lettre, trie A‑Z et items alphabétiquement
- `renderItem` → appel onSelectStand(item)
- ListEmptyComponent affichage "Aucun exposant trouvé"

**Choix :** Recherche globale (pas seulement par première lettre) pour répondre à la demande de filtrage intelligent.

### components/PlanModule/enrichUtils.js

**Rôle :** Enrichit chaque stand avec les données d'entreprise.

**Exports :** `enrichStand`, `enrichAllStands`, `buildCompaniesMap`.

**Logique :**
- MANUAL_MAPPING pour les cas particuliers
- Normalisation via `normalize` (importé de searchUtils)
- 3‑tiers : manuel → exact → fuzzy (unique candidate)

**Pourquoi :** Centraliser le matching afin que le plan et la liste utilisent exactement les mêmes données.

### components/PlanModule/searchUtils.js

**Exports :** `normalize` (lowercase, NFD, strip accents, trim) et `filterStands` (utilisé par SearchBar).

**Rôle :** Source unique de normalisation – utilisée tant par enrichUtils que par la recherche.

### components/PlanModule/planConfig.js

**Exports :** PLAN_RATIO (fallback ratio si l'image ne charge pas).

### data/stands_2025.js & data/stands_2025.json

**Contenu :** Tableau d'objets stand (id, position_x, position_y, stand_w, stand_h, company_name, stand_number…).

**Utilisation :** Importé via `standsIndex.js` → standsCurrent.

### data/standsIndex.js

```javascript
import { stands_2025 } from './stands_2025';
export const standsCurrent = stands_2025;   // future‑proof: changer d'année ici
```

### data/companies.js

Tableau d'objets entreprise (id, name, field, details, website).

### Screen/PlanScreen.js

**Rôle :** Écran qui rend `<InteractiveMap />`.

**Modifications :** Import du nouveau composant (pas de logique supplémentaire).

---

## 5️⃣ Flux fonctionnels (du point de vue utilisateur)

1. **Ouvrir l'écran Plan** → `PlanScreen` rend `<InteractiveMap/>`.

2. **Zoom / Pan**
   - Web : scroll + wheel
   - Native : pinch‑to‑zoom via ReactNativeZoomableView

3. **Tap sur un stand** → `handleStandPress` → `StandBottomSheet` s'ouvre, le stand devient jaune (isSelected)

4. **Recherche live (SearchBar)**
   - Saisie → `filterStands` → suggestions sous forme de SectionList (déjà implémenté)
   - Sélection d'un résultat → `handleSearchResultSelect` → `focusOnStand` (scroll/zoom) + bottom‑sheet

5. **Liste des exposants (bouton flottant)**
   - Ouvre `ExhibitorsList` modal
   - Saisie dans la barre de recherche interne → filtrage global (ex. « o » montre tous les exposants contenant « o », regroupés par première lettre)
   - Sélection d'un item → `handleSelectFromList` → ferme la modal, ouvre bottom‑sheet, auto‑focus sur le stand (scroll ou zoom)

6. **Site web** → bouton dans bottom‑sheet ouvre le site dans un nouvel onglet (web) ou via Linking (native)

---

## 6️⃣ Pipeline de données (VGG → JSON → App)

| Étape | Description | Fichier concerné |
|-------|-------------|------------------|
| CSV VGG | Export du plan (colonnes : id, x %, y %, w %, h %, company_name, stand_number) | — |
| Conversion | Script interne (non‑commité) : csv_to_json.py → `stands_2025.json` | `data/stands_2025.json` |
| Import | `stands_2025.js` (ES module) exporte le tableau (identique à JSON) | `data/stands_2025.js` |
| Index | `standsIndex.js` expose standsCurrent (facile à changer pour une autre année) | `data/standsIndex.js` |
| Enrichissement | `enrichAllStands` utilise companies (data/companies.js) et `normalize` pour associer chaque stand à son entreprise | `components/PlanModule/enrichUtils.js` |
| Affichage | InteractiveMap.* consomme standsEnriched | `components/PlanModule/InteractiveMap.*` |
| Ajout d'une nouvelle année | Créer stands_2026.js (ou .json), mettre à jour `standsIndex.js` (export const standsCurrent = stands_2026;). Aucun autre changement requis | `data/stands_2026.js` + `data/standsIndex.js` |

---

## 7️⃣ Comment tester / vérifier

### Web (desktop)

`npm start` (ou `npx expo start`) → ouvrir dans navigateur.

**Vérifier :**
- Le plan s'affiche, le bouton "📋 Liste" est visible en haut
- Zoom : wheel + drag → le plan reste fluide
- Tap sur un stand → bottom‑sheet apparaît, stand en jaune
- SearchBar : tapez "maroc" → dropdown apparaît, sélection → la vue se recentre sur le stand (smooth scroll)
- Liste : ouvrez la modal, tapez "o" → tous les exposants contenant "o" apparaissent sous leurs sections (A, B, C…). Sélection → le plan scroll vers le stand
- Site web : cliquez sur le bouton "🌐 Voir le site web" → nouvel onglet s'ouvre
- Fallback : désactivez temporairement scrollViewRef (ex. scrollViewRef.current = null) → le click ne crash pas, un warning apparaît

### Mobile (Android / iOS)

`npx expo start` → QR code → ouvrir sur appareil.

**Gestes :** pinch‑to‑zoom, drag‑to‑pan → le plan reste réactif
**Tap sur un stand :** bottom‑sheet + highlight
**SearchBar :** même comportement que web, le stand se recentre via zoomToLocation
**Liste :** ouvrez la modal, filtrez, sélection → le stand se centre et le zoom passe à 2
**Site web :** bouton ouvre le navigateur intégré (Linking)
**Fallback :** forcez zoomableViewRef à null (ex. via console) → le click ouvre la bottom‑sheet sans zoom, warning affiché

**À noter :** les tests de gestes sur Android restent à valider sur plusieurs appareils (actuellement fonctionnels sur l'émulateur).

---

## 8️⃣ Limites connues + risques

| Limite | Impact | Mitigation |
|--------|--------|-----------|
| Gestes Android | Certains appareils peuvent interpréter le double‑tap comme zoom involontaire | Tester sur plusieurs modèles, ajuster maxZoom/minZoom |
| Qualité du plan PNG | Si le ratio ou la résolution change, les % de position peuvent être décalés | Mettre à jour PLAN_RATIO dans `planConfig.js` ou recalculer les pourcentages |
| Fuzzy matching | Le matching automatique peut associer un stand à la mauvaise entreprise (cas rares) | Log console.warn déjà présent, surveiller les logs, ajouter des entrées dans MANUAL_MAPPING |
| Performance sur très gros plan | SectionList charge tous les items en mémoire | Utiliser initialNumToRender ou pagination si le nombre de stands dépasse 500 |
| API ZoomableView | Sur web, ReactNativeZoomableView n'existe pas → fallback | Le code prévoit un fallback (scroll) et un warning |

---

## 9️⃣ Prochaines étapes suggérées

| Étape | Description | Priorité |
|-------|-------------|----------|
| Landmarks / services | Ajouter des icônes (WC, Entrée, Cafétéria) sur le plan, filtres par catégorie | Haute |
| Itinéraire | Sélection du stand de départ + destination → tracé d'un chemin (A* ou simple ligne) | Moyenne |
| Filtres par secteur | Boutons de filtre (Tech, Santé, etc.) dans la barre de recherche | Moyenne |
| Polish UI | Animations d'ouverture du modal, effets de survol, thème sombre | Basse |
| Tests automatisés | Jest + React‑Native‑Testing‑Library pour enrichUtils et searchUtils | Basse |
| Documentation | Ajouter des commentaires JSDoc dans chaque utilitaire | Basse |

---

## 🔟 Guide rapide pour reviewer (colleague)

| Point de contrôle | Fichier / ligne clé |
|------------------|-------------------|
| Import du nouveau composant | `Screen/PlanScreen.js` (ligne où `<InteractiveMap/>` est rendu) |
| Bouton flottant | `InteractiveMap.web.js` & `InteractiveMap.native.js` – style listButton (top = 80) |
| Auto‑focus web | `focusOnStand` (ligne ≈ 70) – calcule scrollX/Y et scrollTo |
| Auto‑focus native | `focusOnStand` (ligne ≈ 70) – zoomToLocation / moveTo |
| Enrichissement | `enrichUtils.js` – MANUAL_MAPPING, `buildCompaniesMap` |
| Recherche globale dans liste | `ExhibitorsList.js` – useMemo avec searchQuery |
| Site web | `StandBottomSheet.js` – `handleWebsitePress` |
| Fallbacks | if (!ref) … warnings dans `handleSelectFromList` (web & native) |
| Tests manuels | 1️⃣ Ouvrir plan → zoom/pan. 2️⃣ Tap stand → bottom‑sheet. 3️⃣ SearchBar → sélection → focus. 4️⃣ Liste → recherche → sélection → focus. 5️⃣ Site web → ouverture |
| Lint / console | Vérifier qu'aucun console.log critique n'est laissé (peut être gardé en dev) |

---

## 📦 Diff quick view

| Fichier | Type | Modification principale |
|---------|------|----------------------|
| `components/PlanModule/ExhibitorsList.js` | ✅ Nouveau | Modal + SectionList + recherche interne |
| `components/PlanModule/InteractiveMap.web.js` | ✏️ Modifié | Bouton flottant déplacé en haut, `handleSelectFromList` → `focusOnStand` (scroll) |
| `components/PlanModule/InteractiveMap.native.js` | ✏️ Modifié | `handleSelectFromList` → `focusOnStand` (zoom = 2) |
| `components/PlanModule/StandBottomSheet.js` | ✏️ Modifié | Réactivation du bouton site web avec protection URL |
| `components/PlanModule/enrichUtils.js` | ✏️ Modifié | Aucun changement majeur (déjà présent) |
| `components/PlanModule/searchUtils.js` | ✏️ Modifié | Aucun changement majeur (déjà présent) |
| `Screen/PlanScreen.js` | ✏️ Modifié | Import du nouveau `InteractiveMap` |
| `data/stands_2025.js` & `data/stands_2025.json` | — | Données brutes du plan (inchangées) |
| `data/companies.js` | — | Données entreprises (inchangées) |