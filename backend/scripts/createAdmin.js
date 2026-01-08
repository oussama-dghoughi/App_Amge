const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const { sequelize, connectDB } = require('../config/database');

// Charger les variables d'environnement depuis le dossier backend
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    // Connexion à PostgreSQL
    await connectDB();

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      console.log('✅ Un administrateur existe déjà avec l\'email:', existingAdmin.email);
      await sequelize.close();
      process.exit(0);
    }

    // Créer l'admin
    const admin = await User.create({
      name: 'Admin',
      surname: 'System',
      email: 'admin@amge.com',
      password: 'admin123', // Changez ce mot de passe en production
      userType: 'autre',
      role: 'admin',
      isActive: true,
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe par défaut: admin123');
    console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion !');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    await sequelize.close();
    process.exit(1);
  }
};

createAdmin();
