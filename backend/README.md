# Backend API - Application AMGE

Backend Node.js/Express pour l'application AMGE avec authentification et gestion des utilisateurs utilisant PostgreSQL.

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` à la racine du dossier backend (copier `.env.example`) :
```bash
cp .env.example .env
```

3. Configurer les variables d'environnement dans `.env` :
   - `PORT` : Port du serveur (défaut: 5000)
   - `DB_HOST` : Hôte PostgreSQL (défaut: localhost)
   - `DB_PORT` : Port PostgreSQL (défaut: 5432)
   - `DB_NAME` : Nom de la base de données (défaut: app_amge)
   - `DB_USER` : Utilisateur PostgreSQL (défaut: postgres)
   - `DB_PASSWORD` : Mot de passe PostgreSQL
   - `JWT_SECRET` : Clé secrète pour JWT (changez-la en production)
   - `JWT_EXPIRE` : Durée de validité du token (défaut: 7d)
   - `CORS_ORIGIN` : Origins autorisées pour CORS

4. S'assurer que PostgreSQL est installé et en cours d'exécution

5. ⚡ **La base de données sera créée automatiquement** lors du premier démarrage du serveur

6. (Optionnel) Créer un utilisateur admin :
```bash
node scripts/createAdmin.js
```

## 📦 Dépendances principales

- **Express** : Framework web
- **PostgreSQL/Sequelize** : Base de données ORM
- **JWT** : Authentification par tokens
- **bcryptjs** : Hashage des mots de passe
- **express-validator** : Validation des données
- **cors** : Gestion CORS

## 🏃 Démarrage

### Mode développement (avec nodemon)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## 📡 Endpoints API

### Authentification (`/api/auth`)

- **POST** `/api/auth/register` - Inscription
  ```json
  {
    "name": "Nom",
    "surname": "Prénom",
    "email": "email@example.com",
    "password": "password123",
    "userType": "etudiant" | "salarie" | "autre",
    "status": "Statut optionnel",
    "domain": "Domaine optionnel",
    "track": "Parcours optionnel"
  }
  ```

- **POST** `/api/auth/login` - Connexion
  ```json
  {
    "email": "email@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/me` - Obtenir le profil (Protégé)
- **PUT** `/api/auth/update-profile` - Mettre à jour le profil (Protégé)
- **PUT** `/api/auth/change-password` - Changer le mot de passe (Protégé)

### Back Office (`/api/admin`) - Admin uniquement

- **GET** `/api/admin/users` - Liste des utilisateurs (avec pagination)
  - Query params: `page`, `limit`, `search`, `userType`, `role`
- **GET** `/api/admin/users/:id` - Détails d'un utilisateur
- **PUT** `/api/admin/users/:id` - Modifier un utilisateur
- **DELETE** `/api/admin/users/:id` - Supprimer un utilisateur
- **PATCH** `/api/admin/users/:id/toggle-active` - Activer/Désactiver un utilisateur
- **GET** `/api/admin/stats` - Statistiques

## 🔐 Authentification

Toutes les routes protégées nécessitent un header :
```
Authorization: Bearer <token>
```

## 📝 Structure du projet

```
backend/
├── config/          # Configuration (base de données)
├── controllers/     # Contrôleurs (logique métier)
├── middleware/      # Middleware (auth, validation)
├── models/          # Modèles Sequelize
├── routes/          # Routes Express
├── scripts/         # Scripts utilitaires
├── utils/           # Utilitaires
├── server.js        # Point d'entrée
└── package.json
```

## 👤 Modèle User

- `id` : UUID (clé primaire)
- `name` : Nom (requis)
- `surname` : Prénom (requis)
- `email` : Email (requis, unique, normalisé en lowercase)
- `password` : Mot de passe hashé (requis, min 6 caractères)
- `userType` : Type d'utilisateur (`etudiant`, `salarie`, `autre`) - défaut: `autre`
- `status` : Statut (optionnel, défaut: "Non spécifié")
- `domain` : Domaine (optionnel, défaut: "Non spécifié")
- `track` : Parcours (optionnel, défaut: "Non spécifié")
- `role` : Rôle (`user`, `admin`) - défaut: `user`
- `isActive` : Compte actif/inactif - défaut: `true`
- `lastLogin` : Date de dernière connexion
- `createdAt`, `updatedAt` : Timestamps automatiques

## 🔧 Créer un utilisateur admin

Pour créer un utilisateur admin, utilisez le script fourni :

```bash
node scripts/createAdmin.js
```

Cela créera un utilisateur admin avec :
- Email: `admin@amge.com`
- Mot de passe: `admin123`
- ⚠️ **IMPORTANT**: Changez le mot de passe après la première connexion !

## 📝 Notes

- Les mots de passe sont automatiquement hashés avec bcrypt avant sauvegarde
- Les tokens JWT expirent par défaut après 7 jours
- Tous les emails sont normalisés en lowercase automatiquement
- La validation des données est effectuée avec express-validator et Sequelize
- Les modèles sont synchronisés automatiquement en développement (utilisez les migrations en production)
- Le modèle User utilise un scope par défaut qui exclut le mot de passe des résultats

## 🔧 Configuration PostgreSQL

### Installation PostgreSQL (macOS)
```bash
brew install postgresql
brew services start postgresql
```

### ⚡ Création automatique de la base de données

**La base de données sera créée automatiquement** lors du premier démarrage du serveur. Vous n'avez pas besoin de la créer manuellement !

Le système va :
1. Se connecter à PostgreSQL
2. Vérifier si la base de données existe
3. La créer automatiquement si elle n'existe pas
4. Créer toutes les tables nécessaires

### Vérifier la connexion (optionnel)
```bash
psql -U postgres -d app_amge
```
