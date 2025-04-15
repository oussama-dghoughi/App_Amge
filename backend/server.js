const express = require('express');
const connectDB = require('./config/db'); // Assurez-vous que ce chemin est correct
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Assurez-vous que ce chemin est correct
require('dotenv').config();

const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(express.json()); // Pour parser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les requêtes URL-encoded
app.use(cors({
    origin: 'http://192.168.1.111:8081', // URL du serveur Metro Bundler
  credentials: true, // Autoriser les cookies et les en-têtes d'authentification
}));

// Routes
app.use('/api/auth', authRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ msg: 'Erreur serveur', error: err.message });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});