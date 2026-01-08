# 🔍 Guide de débogage - Problème de connexion

## ✅ Améliorations apportées

1. **Messages d'erreur plus détaillés** - Affichage des erreurs réseau et serveur
2. **Feedback visuel** - Indicateur de chargement pendant la connexion
3. **Console logging** - Logs dans la console du navigateur pour le débogage
4. **Gestion d'erreurs améliorée** - Meilleure détection des problèmes de connexion

## 🔍 Vérifications à faire

### 1. Ouvrir la console du navigateur

1. Ouvrez l'application sur `http://localhost:3001`
2. Appuyez sur `F12` (ou `Cmd+Option+I` sur Mac)
3. Allez dans l'onglet **Console**
4. Essayez de vous connecter
5. Regardez les messages affichés

### 2. Vérifier que le backend est démarré

Le backend doit être en cours d'exécution sur le port 5000 :

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
🚀 Serveur démarré sur le port 5000
🌐 API disponible sur: http://localhost:5000
```

### 3. Tester l'API directement

Ouvrez votre navigateur et allez sur :
```
http://localhost:5000
```

Vous devriez voir un message JSON indiquant que le serveur fonctionne.

### 4. Vérifier les erreurs CORS

Si vous voyez des erreurs CORS dans la console :

1. Vérifiez que le fichier `backend/.env` contient :
   ```
   CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://172.20.10.2:19006
   ```

2. **Redémarrez le serveur backend** après modification du .env

### 5. Vérifier le fichier .env de l'admin-web

Le fichier `admin-web/.env` doit contenir :
```
VITE_API_URL=http://localhost:5000/api
```

Si vous l'avez modifié, **redémarrez le serveur de développement** de l'admin-web.

## 🐛 Messages d'erreur courants

### "Impossible de contacter le serveur"

**Cause** : Le backend n'est pas démarré ou inaccessible

**Solution** :
- Vérifiez que le backend tourne sur le port 5000
- Testez `http://localhost:5000` dans votre navigateur

### "Accès refusé. Vous devez être administrateur"

**Cause** : Vous utilisez un compte utilisateur normal, pas un admin

**Solution** :
- Créez un compte admin avec : `cd backend && node scripts/createAdmin.js`
- Utilisez : email: `admin@amge.com`, password: `admin123`

### Erreur CORS

**Cause** : Le backend n'autorise pas les requêtes depuis localhost:3001

**Solution** :
- Vérifiez que `CORS_ORIGIN` dans `backend/.env` inclut `http://localhost:3001`
- Redémarrez le serveur backend

### Erreur 404

**Cause** : L'URL de l'API est incorrecte

**Solution** :
- Vérifiez que `VITE_API_URL` dans `admin-web/.env` est `http://localhost:5000/api`
- Redémarrez le serveur de développement

## 📝 Test rapide

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet **Network** (Réseau)
3. Essayez de vous connecter
4. Cherchez la requête vers `/api/auth/login`
5. Cliquez dessus pour voir les détails :
   - **Status** : Doit être 200 ou 401 (pas 404 ou erreur CORS)
   - **Response** : Doit contenir un JSON avec `success` et `token` ou `msg`

## 🔧 Actions correctives

Si rien ne s'affiche du tout :

1. **Vérifiez la console du navigateur** pour les erreurs JavaScript
2. **Vérifiez l'onglet Network** pour voir si la requête est envoyée
3. **Redémarrez les deux serveurs** :
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Admin Web
   cd admin-web
   npm run dev
   ```
4. **Videz le cache du navigateur** : Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)

## 💡 Informations de débogage

Maintenant, lors de la connexion, vous verrez dans la console :
- Les tentatives de connexion
- Les réponses du serveur
- Les erreurs détaillées

Cela vous aidera à identifier précisément le problème.

