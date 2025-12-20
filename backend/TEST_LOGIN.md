# 🔐 Guide : Tester la connexion avec Postman

## Étape 1 : S'assurer qu'un utilisateur existe

Avant de tester la connexion, vous devez avoir un utilisateur inscrit. Si ce n'est pas le cas :

1. **Testez d'abord l'inscription** (voir `TEST_POSTMAN.md`)
2. **OU** utilisez l'utilisateur admin créé avec le script

---

## Étape 2 : Tester la connexion

### Configuration de la requête

**Méthode** : `POST`  
**URL** : `http://localhost:5000/api/auth/login`

### Headers

- Cliquez sur l'onglet **"Headers"**
- Ajoutez :
  - Key: `Content-Type`
  - Value: `application/json`

### Body

- Cliquez sur l'onglet **"Body"**
- Sélectionnez **"raw"**
- Dans le menu déroulant, sélectionnez **"JSON"**
- Copiez-collez ce JSON :

```json
{
  "email": "jean.dupont@example.com",
  "password": "password123"
}
```

**Important** : Utilisez l'email et le mot de passe d'un utilisateur existant !

### Exemples pour tester

**Avec l'utilisateur créé précédemment** :
```json
{
  "email": "jean.dupont@example.com",
  "password": "password123"
}
```

**Avec l'admin** (si créé) :
```json
{
  "email": "admin@amge.com",
  "password": "admin123"
}
```

---

## Étape 3 : Envoyer la requête

1. Cliquez sur le bouton **"Send"** (bleu)
2. Vous devriez voir une réponse comme :

```json
{
  "success": true,
  "msg": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Ni0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTIiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDYwNDgwMH0.xxxxx",
  "user": {
    "id": "uuid-here",
    "name": "Dupont",
    "surname": "Jean",
    "email": "jean.dupont@example.com",
    "userType": "etudiant",
    "role": "user",
    "status": "Étudiant en Master",
    "domain": "Informatique",
    "track": "Master 2"
  }
}
```

---

## ✅ Résultat attendu

- **Status** : `200 OK` (en vert)
- **Réponse** : JSON avec :
  - `success: true`
  - `token` : Le token JWT à utiliser pour les routes protégées
  - `user` : Les informations de l'utilisateur

---

## 💡 Astuce : Sauvegarder le token automatiquement

Si vous avez importé la collection Postman (`postman_collection.json`), le token est automatiquement sauvegardé dans une variable après la connexion et sera réutilisé pour les autres requêtes.

### Pour sauvegarder manuellement le token :

1. **Copiez le token** de la réponse
2. **Créez une variable** dans Postman :
   - Cliquez sur l'icône "Environments" (coin supérieur droit)
   - Créez un nouvel environnement "Local"
   - Ajoutez une variable `token` avec la valeur copiée

3. **Utilisez le token** dans les requêtes protégées :
   - Dans l'onglet Headers, ajoutez :
     - Key: `Authorization`
     - Value: `Bearer {{token}}`

---

## ❌ Erreurs possibles

### Erreur 401 - Email ou mot de passe incorrect

```json
{
  "success": false,
  "msg": "Email ou mot de passe incorrect"
}
```

**Solutions** :
- Vérifiez que l'email est correct (sensible à la casse)
- Vérifiez que le mot de passe est correct
- Assurez-vous que l'utilisateur existe (testez d'abord l'inscription)

### Erreur 400 - Validation

```json
{
  "success": false,
  "msg": "Erreurs de validation",
  "errors": [
    {
      "msg": "Veuillez entrer un email valide",
      "param": "email"
    }
  ]
}
```

**Solutions** :
- Vérifiez que l'email est au format valide
- Vérifiez que le mot de passe n'est pas vide

### Erreur 401 - Compte désactivé

```json
{
  "success": false,
  "msg": "Votre compte a été désactivé. Contactez l'administrateur."
}
```

**Solution** : Le compte a été désactivé par un administrateur

---

## 📋 Prochaines étapes après connexion

Une fois connecté avec succès :

1. **Copiez le token** de la réponse
2. **Testez une route protégée** :
   - Méthode: `GET`
   - URL: `http://localhost:5000/api/auth/me`
   - Headers: `Authorization: Bearer VOTRE_TOKEN`
   - Cela devrait retourner vos informations de profil

3. **Testez la mise à jour du profil** :
   - Méthode: `PUT`
   - URL: `http://localhost:5000/api/auth/update-profile`
   - Headers: `Authorization: Bearer VOTRE_TOKEN`
   - Body: JSON avec les champs à modifier

---

## 🔄 Flux complet : Inscription → Connexion → Profil

1. **Inscription** : Créer un compte
   ```
   POST /api/auth/register
   ```

2. **Connexion** : Obtenir un token
   ```
   POST /api/auth/login
   ```

3. **Profil** : Accéder à vos informations (avec le token)
   ```
   GET /api/auth/me
   Headers: Authorization: Bearer TOKEN
   ```

---

## 📝 Exemple de requête complète

**Méthode** : POST  
**URL** : `http://localhost:5000/api/auth/login`  
**Headers** :
```
Content-Type: application/json
```
**Body** :
```json
{
  "email": "jean.dupont@example.com",
  "password": "password123"
}
```

**Réponse** :
```json
{
  "success": true,
  "msg": "Connexion réussie",
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "name": "Dupont",
    "surname": "Jean",
    "email": "jean.dupont@example.com",
    "userType": "etudiant",
    "role": "user"
  }
}
```

