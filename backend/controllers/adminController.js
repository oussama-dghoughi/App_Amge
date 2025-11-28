const User = require('../models/User');
const Company = require('../models/Company');
const Offer = require('../models/Offer');

const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// @desc    Obtenir tous les utilisateurs (avec pagination)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const userType = req.query.userType || '';
    const role = req.query.role || '';

    // Construire le filtre de recherche
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { surname: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (userType) {
      where.userType = userType;
    }
    if (role) {
      where.role = role;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      users,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Créer un nouvel utilisateur
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, surname, email, password, userType, status, domain, track, role, isActive } = req.body;

    // Vérifier si l'email existe déjà
    const emailExists = await User.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (emailExists) {
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
      password: password || 'password123', // Mot de passe par défaut si non fourni
      userType: userType || 'autre',
      status: status || 'Non spécifié',
      domain: domain || 'Non spécifié',
      track: track || 'Non spécifié',
      role: role || 'user',
      isActive: isActive !== undefined ? isActive : true,
    });

    // Retourner l'utilisateur sans le mot de passe
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      msg: 'Utilisateur créé avec succès',
      user: userResponse,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    
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
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Obtenir un utilisateur par ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'Utilisateur non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Mettre à jour un utilisateur
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, surname, email, userType, status, domain, track, role, isActive } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'Utilisateur non trouvé',
      });
    }

    // Vérifier si l'email existe déjà pour un autre utilisateur
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ 
        where: { 
          email: email.toLowerCase(),
          id: { [Op.ne]: req.params.id }
        } 
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          msg: 'Cet email est déjà utilisé par un autre utilisateur',
        });
      }
      user.email = email.toLowerCase();
    }

    // Mettre à jour les autres champs
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (userType) user.userType = userType;
    if (status !== undefined) user.status = status;
    if (domain !== undefined) user.domain = domain;
    if (track !== undefined) user.track = track;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    // Retourner l'utilisateur sans le mot de passe
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      msg: 'Utilisateur mis à jour avec succès',
      user: userResponse,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        msg: 'Cet email est déjà utilisé par un autre utilisateur',
      });
    }

    res.status(500).json({
      success: false,
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'Utilisateur non trouvé',
      });
    }

    // Ne pas permettre la suppression de son propre compte
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        msg: 'Vous ne pouvez pas supprimer votre propre compte',
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      msg: 'Utilisateur supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Activer/Désactiver un utilisateur
// @route   PATCH /api/admin/users/:id/toggle-active
// @access  Private/Admin
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'Utilisateur non trouvé',
      });
    }

    // Ne pas permettre de désactiver son propre compte
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        msg: 'Vous ne pouvez pas désactiver votre propre compte',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    // Retourner l'utilisateur sans le mot de passe
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      msg: `Utilisateur ${user.isActive ? 'activé' : 'désactivé'} avec succès`,
      user: userResponse,
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    res.status(500).json({
      success: false,
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Obtenir les statistiques
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCompanies = await Company.count();
    const totalOffers = await Offer.count();

    const activeUsers = await User.count({ where: { isActive: true } });
    const inactiveUsers = await User.count({ where: { isActive: false } });
    const adminUsers = await User.count({ where: { role: 'admin' } });
    
    // Utilisateurs par type
    const Sequelize = require('sequelize');
    const usersByType = await User.findAll({
      attributes: [
        'userType',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['userType'],
      raw: true,
    });

    // Formatage des résultats
    const formattedUsersByType = usersByType.map(item => ({
      _id: item.userType,
      count: parseInt(item.count),
    }));

    const recentUsers = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });
    // Dernières entreprises ajoutées
    const recentCompanies = await Company.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    // Dernières offres ajoutées
    const recentOffers = await Offer.findAll({
      include: [{ model: Company }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers,
        usersByType: formattedUsersByType,
        recentUsers,
        totalCompanies,
        totalOffers,
        recentCompanies,
        recentOffers,
      },

    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      msg: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
