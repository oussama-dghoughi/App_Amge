const Company = require('../models/Company');

// GET /api/admin/companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, companies });
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
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, company });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

// PUT /api/admin/companies/:id
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ success: false, msg: 'Entreprise non trouvée' });
    
    await company.update(req.body);
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
