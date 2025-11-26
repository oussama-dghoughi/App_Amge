# 🧪 Test de connexion - Guide rapide

## ✅ Vérifications préalables

### 1. Backend démarré
Le backend répond correctement sur `http://localhost:5000` ✅

### 2. Créer un compte admin (si pas déjà fait)

```bash
cd backend
node scripts/createAdmin.js
```

Cela créera un compte avec :
- **Email** : `admin@amge.com`
- **Mot de passe** : `admin123`

### 3. Tester la connexion

1. Ouvrez `http://localhost:3001` dans votre navigateur
2. Ouvrez la console (F12 > Console)
3. Entrez :
   - Email : `admin@amge.com`
   - Mot de passe : `admin123`
4. Cliquez sur "Se connecter"

## 📊 Ce que vous devriez voir

### ✅ Si ça fonctionne :
- Message "Connexion en cours..." avec spinner
- Redirection vers le dashboard avec la liste des utilisateurs

### ❌ Si ça ne fonctionne pas :

**Dans la console, vous verrez :**
- `AuthContext: Tentative de connexion...`
- `AuthContext: Réponse reçue: {...}`
- Ou des messages d'erreur détaillés

**Messages d'erreur possibles :**

1. **"Impossible de contacter le serveur"**
   - Le backend n'est pas démarré
   - Solution : `cd backend && npm run dev`

2. **"Email ou mot de passe incorrect"**
   - Mauvais identifiants
   - Solution : Utilisez `admin@amge.com` / `admin123`

3. **"Accès refusé. Vous devez être administrateur"**
   - Le compte n'est pas admin
   - Solution : Créez un compte admin avec le script

4. **Erreur CORS**
   - Le backend n'autorise pas localhost:3001
   - Solution : Vérifiez `CORS_ORIGIN` dans `backend/.env` et redémarrez

## 🔍 Test manuel de l'API

Testez directement dans la console du navigateur :

```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@amge.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

Si ça fonctionne, vous devriez voir un objet avec `success: true` et un `token`.

## 💡 Informations utiles

Tous les logs de connexion sont maintenant affichés dans la console du navigateur. Regardez-les pour identifier le problème précis.

