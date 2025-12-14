const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Liste des origines autorisées depuis .env
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:3000', 'http://localhost:3001'];

    // En développement, autoriser aussi les requêtes sans origine (Postman, curl, etc.)
    if (process.env.NODE_ENV === 'development') {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS: Origine non autorisée: ${origin}`);
        callback(null, true); // En dev, on autorise quand même pour faciliter les tests
      }
    } else {
      // En production, stricte
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/stands', require('./routes/standRoutes')); // Routes pour les stands

// Route de test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API AMGE Backend - Serveur actif',
    version: '1.0.0',
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    msg: 'Route non trouvée',
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({
    success: false,
    msg: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

// Démarrer le serveur après la connexion à la base de données
const startServer = async () => {
  try {
    // Connexion à la base de données (créera automatiquement la base si elle n'existe pas)
    await connectDB();

    // Démarrer le serveur Express
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📝 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API disponible sur: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
