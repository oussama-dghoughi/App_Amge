# 🚀 Guide de démarrage rapide - Admin Web

## 1. Installation

```bash
cd admin-web
npm install
```

## 2. Configuration

Créez un fichier `.env` à la racine de `admin-web` :

```env
VITE_API_URL=http://localhost:5000/api
```

## 3. Démarrer le backend

Assurez-vous que le backend est démarré :

```bash
cd ../backend
npm run dev
```

Le backend doit être accessible sur `http://localhost:5000`

## 4. Démarrer l'application admin

```bash
cd admin-web
npm run dev
```

L'application sera disponible sur `http://localhost:3001`

## 5. Connexion

### Créer un compte admin (si pas déjà fait)

```bash
cd ../backend
node scripts/createAdmin.js
```

### Se connecter

1. Ouvrez `http://localhost:3001` dans votre navigateur
2. Utilisez les identifiants :
   - **Email** : `admin@amge.com`
   - **Mot de passe** : `admin123`

⚠️ **Important** : Changez le mot de passe après la première connexion !

## 📋 Fonctionnalités disponibles

Une fois connecté, vous pouvez :

- ✅ Voir la liste des utilisateurs
- ✅ Rechercher des utilisateurs
- ✅ Filtrer par type et rôle
- ✅ Créer de nouveaux utilisateurs
- ✅ Modifier des utilisateurs existants
- ✅ Supprimer des utilisateurs
- ✅ Activer/Désactiver des comptes
- ✅ Voir les statistiques

## 🐛 Dépannage

### L'application ne se connecte pas au backend

- Vérifiez que le backend est bien démarré sur le port 5000
- Vérifiez que `VITE_API_URL` dans `.env` est correct

### Erreur 401 (Non autorisé)

- Vérifiez que vous utilisez un compte avec le rôle `admin`
- Essayez de vous déconnecter et reconnecter

### Erreur CORS

- Vérifiez que le backend autorise les requêtes depuis `http://localhost:3001`
- Dans `backend/.env`, assurez-vous que `CORS_ORIGIN` inclut `http://localhost:3001`

