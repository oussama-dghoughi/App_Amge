# AMGE Admin Web

Interface web d'administration pour gérer les utilisateurs de l'application AMGE.

## 🚀 Installation

```bash
cd admin-web
npm install
```

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:5000/api
```

Par défaut, l'application utilise `http://localhost:5000/api` pour communiquer avec le backend.

## 🏃 Démarrage

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3001`

## 📋 Fonctionnalités

### Authentification
- Connexion avec email et mot de passe
- Vérification du rôle administrateur
- Gestion automatique du token JWT

### Gestion des utilisateurs
- Liste des utilisateurs avec pagination
- Recherche par nom, prénom ou email
- Filtrage par type d'utilisateur et rôle
- Création d'utilisateurs
- Modification d'utilisateurs
- Suppression d'utilisateurs
- Activation/Désactivation de comptes

### Statistiques
- Vue d'ensemble des utilisateurs
- Répartition par type
- Liste des derniers utilisateurs inscrits

## 🔐 Connexion

Pour vous connecter, vous devez avoir un compte administrateur.

Si vous n'avez pas encore créé d'admin :

```bash
cd ../backend
node scripts/createAdmin.js
```

Identifiants par défaut :
- Email: `admin@amge.com`
- Mot de passe: `admin123`

⚠️ **Important** : Changez le mot de passe après la première connexion !

## 📝 Technologies utilisées

- **React 18** - Bibliothèque UI
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **React Icons** - Icônes
- **Vite** - Build tool

## 🏗️ Structure du projet

```
admin-web/
├── src/
│   ├── components/
│   │   ├── Login/          # Page de connexion
│   │   ├── Dashboard/      # Layout principal
│   │   ├── Users/          # Gestion des utilisateurs
│   │   ├── Stats/          # Statistiques
│   │   └── common/         # Composants communs
│   ├── context/            # Context API (Auth)
│   ├── services/           # Services API
│   └── utils/              # Utilitaires
├── public/
└── package.json
```

## 🔧 Scripts disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run preview` - Prévisualiser le build de production

## 🌐 Routes

- `/login` - Page de connexion
- `/users` - Liste et gestion des utilisateurs
- `/stats` - Statistiques

## 📱 Responsive

L'interface est responsive et fonctionne sur desktop et tablette.

