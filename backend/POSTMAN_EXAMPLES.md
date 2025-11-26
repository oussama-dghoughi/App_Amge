# Guide de test API avec Postman

## 📋 Configuration de base

- **URL de base** : `http://localhost:5000`
- **Content-Type** : `application/json`

---

## 🔐 Authentification

### 1. Inscription (Register)

**Méthode** : `POST`  
**URL** : `http://localhost:5000/api/auth/register`

**Headers** :
```
Content-Type: application/json
```

**Body** (JSON) :
```json
{
  "name": "Dupont",
  "surname": "Jean",
  "email": "jean.dupont@example.com",
  "password": "password123",
  "userType": "etudiant",
  "status": "Étudiant en Master",
  "domain": "Informatique",
  "track": "Master 2"
}
```

**Exemples de userType** :
- `"etudiant"`
- `"salarie"`
- `"autre"`

**Champs obligatoires** :
- `name` (nom)
- `surname` (prénom)
- `email`
- `password` (minimum 6 caractères)

**Champs optionnels** :
- `userType` (défaut: "autre")
- `status`
- `domain`
- `track`

**Réponse réussie (201)** :
```json
{
  "success": true,
  "msg": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "Dupont",
    "surname": "Jean",
    "email": "jean.dupont@example.com",
    "userType": "etudiant",
    "role": "user"
  }
}
```

---

### 2. Connexion (Login)

**Méthode** : `POST`  
**URL** : `http://localhost:5000/api/auth/login`

**Headers** :
```
Content-Type: application/json
```

**Body** (JSON) :
```json
{
  "email": "jean.dupont@example.com",
  "password": "password123"
}
```

**Réponse réussie (200)** :
```json
{
  "success": true,
  "msg": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### 3. Obtenir le profil (Get Me) - Route protégée

**Méthode** : `GET`  
**URL** : `http://localhost:5000/api/auth/me`

**Headers** :
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Réponse réussie (200)** :
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "name": "Dupont",
    "surname": "Jean",
    "email": "jean.dupont@example.com",
    "userType": "etudiant",
    "role": "user",
    "status": "Étudiant en Master",
    "domain": "Informatique",
    "track": "Master 2",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastLogin": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### 4. Mettre à jour le profil - Route protégée

**Méthode** : `PUT`  
**URL** : `http://localhost:5000/api/auth/update-profile`

**Headers** :
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body** (JSON) :
```json
{
  "name": "Dupont",
  "surname": "Jean-Pierre",
  "status": "Étudiant en Licence 3",
  "domain": "Mathématiques",
  "track": "Licence 3"
}
```

---

### 5. Changer le mot de passe - Route protégée

**Méthode** : `PUT`  
**URL** : `http://localhost:5000/api/auth/change-password`

**Headers** :
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body** (JSON) :
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

## 👨‍💼 Back Office (Admin uniquement)

### 6. Liste des utilisateurs

**Méthode** : `GET`  
**URL** : `http://localhost:5000/api/admin/users`

**Query Parameters** (optionnels) :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)
- `search` : Recherche par nom, prénom ou email
- `userType` : Filtrer par type (etudiant, salarie, autre)
- `role` : Filtrer par rôle (user, admin)

**Exemple** : `http://localhost:5000/api/admin/users?page=1&limit=10&search=jean&userType=etudiant`

**Headers** :
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

---

### 7. Statistiques

**Méthode** : `GET`  
**URL** : `http://localhost:5000/api/admin/stats`

**Headers** :
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

---

## 📝 Exemples d'erreurs

### Erreur de validation (400)
```json
{
  "success": false,
  "msg": "Erreurs de validation",
  "errors": [
    {
      "msg": "Le nom est requis",
      "param": "name",
      "location": "body"
    }
  ]
}
```

### Email déjà utilisé (400)
```json
{
  "success": false,
  "msg": "Un utilisateur avec cet email existe déjà"
}
```

### Identifiants incorrects (401)
```json
{
  "success": false,
  "msg": "Email ou mot de passe incorrect"
}
```

### Non autorisé (401)
```json
{
  "success": false,
  "msg": "Non autorisé, aucun token fourni"
}
```

---

## 🚀 Étapes pour tester avec Postman

1. **Démarrer le serveur** :
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Tester l'inscription** :
   - Créer une nouvelle requête POST
   - URL : `http://localhost:5000/api/auth/register`
   - Dans l'onglet "Body", sélectionner "raw" et "JSON"
   - Copier le JSON d'exemple ci-dessus
   - Cliquer sur "Send"

3. **Copier le token** de la réponse

4. **Tester une route protégée** :
   - Créer une nouvelle requête GET
   - URL : `http://localhost:5000/api/auth/me`
   - Dans l'onglet "Headers", ajouter :
     - Key : `Authorization`
     - Value : `Bearer YOUR_TOKEN_HERE`
   - Cliquer sur "Send"

---

## 💡 Astuce Postman : Variable d'environnement

Pour simplifier les tests, créez une variable d'environnement dans Postman :

1. Cliquez sur "Environments" (coin supérieur droit)
2. Créez un nouvel environnement "Local Development"
3. Ajoutez les variables :
   - `base_url` : `http://localhost:5000`
   - `token` : (sera rempli après connexion)
4. Utilisez `{{base_url}}/api/auth/register` dans vos requêtes

