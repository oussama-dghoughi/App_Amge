# 🚀 Guide rapide : Tester l'inscription avec Postman

## Étape 1 : Démarrer le serveur

```bash
cd backend

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer le serveur
npm run dev
```

Vous devriez voir :
```
✅ Connexion à PostgreSQL réussie
✅ Base de données "app_amge" créée avec succès
✅ Connexion à la base de données réussie
✅ Modèles synchronisés avec la base de données
🚀 Serveur démarré sur le port 5000
🌐 API disponible sur: http://localhost:5000
```

## Étape 2 : Configurer Postman

### Option A : Importer la collection (Recommandé)

1. Ouvrez Postman
2. Cliquez sur **"Import"** (en haut à gauche)
3. Sélectionnez le fichier `postman_collection.json` dans le dossier backend
4. La collection "AMGE API" apparaîtra dans votre sidebar

### Option B : Créer la requête manuellement

1. Cliquez sur **"New"** > **"HTTP Request"**
2. Configurez la requête :

## Étape 3 : Tester l'inscription

### Configuration de la requête

**Méthode** : `POST`  
**URL** : `http://localhost:5000/api/auth/register`

**Headers** :
- Cliquez sur l'onglet **"Headers"**
- Ajoutez :
  - Key: `Content-Type`
  - Value: `application/json`

**Body** :
- Cliquez sur l'onglet **"Body"**
- Sélectionnez **"raw"**
- Dans le menu déroulant à droite, sélectionnez **"JSON"**
- Copiez-collez ce JSON :

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

### Variantes pour tester

**Test avec un salarié** :
```json
{
  "name": "Martin",
  "surname": "Sophie",
  "email": "sophie.martin@example.com",
  "password": "password123",
  "userType": "salarie"
}
```

**Test minimal (champs obligatoires seulement)** :
```json
{
  "name": "Test",
  "surname": "User",
  "email": "test@example.com",
  "password": "test123"
}
```

## Étape 4 : Envoyer la requête

1. Cliquez sur le bouton **"Send"** (bleu)
2. Vous devriez voir une réponse comme :

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

## ✅ Résultat attendu

- **Status** : `201 Created` (en vert)
- **Réponse** : JSON avec `success: true` et un token

## ❌ Erreurs possibles

### Erreur 500 - Serveur non démarré
- Vérifiez que le serveur est bien démarré
- Vérifiez que PostgreSQL est en cours d'exécution

### Erreur 400 - Validation
```json
{
  "success": false,
  "msg": "Erreurs de validation",
  "errors": [...]
}
```
- Vérifiez que tous les champs obligatoires sont présents
- Vérifiez que l'email est valide
- Vérifiez que le mot de passe fait au moins 6 caractères

### Erreur 400 - Email déjà utilisé
```json
{
  "success": false,
  "msg": "Un utilisateur avec cet email existe déjà"
}
```
- Changez l'email pour un autre qui n'existe pas encore

## 📋 Prochaines étapes

Une fois l'inscription réussie :

1. **Copiez le token** de la réponse
2. **Testez la connexion** :
   - POST `http://localhost:5000/api/auth/login`
   - Avec le même email/password
3. **Testez une route protégée** :
   - GET `http://localhost:5000/api/auth/me`
   - Ajoutez dans Headers : `Authorization: Bearer VOTRE_TOKEN`

## 💡 Astuce : Sauvegarder le token automatiquement

Dans la collection Postman importée, après la connexion (Login), le token est automatiquement sauvegardé et réutilisé pour les autres requêtes !

