const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: 'Non autorisé, aucun token fourni',
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur avec le token
    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        msg: 'Utilisateur non trouvé',
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        msg: 'Votre compte a été désactivé',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: 'Token invalide ou expiré',
    });
  }
};

// Middleware pour vérifier le rôle admin
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        msg: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`,
      });
    }
    next();
  };
};
