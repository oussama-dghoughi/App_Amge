const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom est requis',
        },
      },
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le prénom est requis',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_email',
        msg: 'Cet email est déjà utilisé',
      },
      validate: {
        isEmail: {
          msg: 'Veuillez entrer un email valide',
        },
        notEmpty: {
          msg: 'L\'email est requis',
        },
      },
      set(value) {
        // Normaliser l'email en lowercase
        this.setDataValue('email', value ? value.toLowerCase().trim() : value);
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: 'Le mot de passe doit contenir au moins 6 caractères',
        },
        notEmpty: {
          msg: 'Le mot de passe est requis',
        },
      },
    },
    userType: {
      type: DataTypes.ENUM('etudiant', 'salarie', 'autre'),
      allowNull: false,
      defaultValue: 'autre',
      validate: {
        isIn: {
          args: [['etudiant', 'salarie', 'autre']],
          msg: 'Le type d\'utilisateur doit être: etudiant, salarie ou autre',
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Non spécifié',
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Non spécifié',
    },
    track: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Non spécifié',
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['user', 'admin']],
          msg: 'Le rôle doit être: user ou admin',
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    hooks: {
      // Hash du mot de passe avant création/mise à jour
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  }
);

// Méthode d'instance pour comparer le mot de passe
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
