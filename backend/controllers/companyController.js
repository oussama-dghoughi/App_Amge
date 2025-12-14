const Company = require('../models/Company');

// GET /api/admin/companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, companies }); // Utiliser 'companies' pour cohérence avec frontend
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

// GET /api/admin/companies/:id
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ success: false, msg: 'Entreprise non trouvée' });

    res.json({ success: true, company });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

// POST /api/admin/companies
exports.createCompany = async (req, res) => {
  try {
    // Nettoyer les données : convertir les chaînes vides en null
    const cleanData = { ...req.body };
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === '') {
        cleanData[key] = null;
      }
    });

    const company = await Company.create(cleanData);
    res.status(201).json({ success: true, company });
  } catch (err) {
    console.error('Erreur création entreprise:', err);

    // Validation Sequelize
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(e => ({ field: e.path, message: e.message }));
      return res.status(400).json({
        success: false,
        msg: 'Erreurs de validation',
        errors
      });
    }

    // Contrainte unique
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        msg: 'Une entreprise avec ces informations existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      msg: 'Erreur lors de la création de l\'entreprise',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// PUT /api/admin/companies/:id
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ success: false, msg: 'Entreprise non trouvée' });

    // Nettoyer les données
    const cleanData = { ...req.body };
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === '') {
        cleanData[key] = null;
      }
    });

    await company.update(cleanData);
    res.json({ success: true, company });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

// DELETE /api/admin/companies/:id
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ success: false, msg: 'Entreprise non trouvée' });

    await company.destroy();
    res.json({ success: true, msg: 'Entreprise supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};
