const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: 'Erreurs de validation',
        errors: errors.array(),
      });
    }

    const { name, surname, email, password, userType, status, domain, track } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        msg: 'Un utilisateur avec cet email existe déjà',
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      surname,
      email: email.toLowerCase(),
      password,
      userType: userType || 'autre',
      status: status || 'Non spécifié',
      domain: domain || 'Non spécifié',
      track: track || 'Non spécifié',
    });

    // Générer le token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      msg: 'Inscription réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        userType: user.userType,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    // Gérer les erreurs de validation Sequelize
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        msg: 'Erreurs de validation',
        errors,
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        msg: 'Un utilisateur avec cet email existe déjà',
      });
    }

    res.status(500).json({
      success: false,
      msg: 'Erreur serveur lors de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: 'Erreurs de validation',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe et récupérer le mot de passe
    const user = await User.scope('withPassword').findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: 'Email ou mot de passe incorrect',
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        msg: 'Votre compte a été désactivé. Contactez l\'administrateur.',
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Email ou mot de passe incorrect',
      });
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Générer le token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      msg: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        userType: user.userType,
        role: user.role,
        status: user.status,
        domain: user.domain,
        track: user.track,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      msg: 'Erreur serveur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Obtenir l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'Utilisateur non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        userType: user.userType,
        role: user.role,
        status: user.status,
        domain: user.domain,
        track: user.track,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, surname, status, domain, track } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'Utilisateur non trouvé',
      });
    }

    // Mettre à jour les champs
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (status !== undefined) user.status = status;
    if (domain !== undefined) user.domain = domain;
    if (track !== undefined) user.track = track;

    await user.save();

    res.status(200).json({
      success: true,
      msg: 'Profil mis à jour avec succès',
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        userType: user.userType,
        status: user.status,
        domain: user.domain,
        track: user.track,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        msg: 'Veuillez fournir le mot de passe actuel et le nouveau mot de passe',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        msg: 'Le nouveau mot de passe doit contenir au moins 6 caractères',
      });
    }

    const user = await User.scope('withPassword').findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'Utilisateur non trouvé',
      });
    }

    // Vérifier le mot de passe actuel
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Mot de passe actuel incorrect',
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      msg: 'Mot de passe modifié avec succès',
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      success: false,
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
