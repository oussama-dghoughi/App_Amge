const { Sequelize } = require('sequelize');

// Fonction pour créer la base de données si elle n'existe pas
const createDatabaseIfNotExists = async () => {
  const dbName = process.env.DB_NAME || 'app_amge';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 5432;

  // Se connecter à PostgreSQL sans spécifier de base de données
  const adminSequelize = new Sequelize('postgres', dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
  });

  try {
    await adminSequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL réussie');

    // Vérifier si la base de données existe (utilisation de bind pour la sécurité)
    const results = await adminSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = :dbName`,
      {
        replacements: { dbName },
        type: adminSequelize.QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      // Créer la base de données (échappement du nom pour éviter les injections)
      const escapedDbName = dbName.replace(/"/g, '""');
      await adminSequelize.query(`CREATE DATABASE "${escapedDbName}"`);
      console.log(`✅ Base de données "${dbName}" créée avec succès`);
    } else {
      console.log(`✅ Base de données "${dbName}" existe déjà`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de la base de données:', error.message);
    throw error;
  } finally {
    await adminSequelize.close();
  }
};

// Configuration de la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME || 'app_amge',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    // Créer la base de données si elle n'existe pas
    await createDatabaseIfNotExists();

    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Synchroniser les modèles avec la base de données
    // En production, utilisez les migrations au lieu de sync
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modèles synchronisés avec la base de données');
    }
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error.message);
    
    // Suggestions d'aide
    if (error.message.includes('password authentication failed')) {
      console.error('💡 Vérifiez vos identifiants PostgreSQL dans le fichier .env');
    } else if (error.message.includes('connect ECONNREFUSED')) {
      console.error('💡 Vérifiez que PostgreSQL est démarré et accessible');
      console.error('   Sur macOS: brew services start postgresql');
    }
    
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
