const Offer = require('../models/Offer');
const Company = require('../models/Company');

exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll({
      include: [{ model: Company }],
      order: [['createdAt', 'DESC']]
    });

    // ✅ Transform data to include all necessary information
    const transformedOffers = offers.map(offer => ({
      id: offer.id,
      _id: offer.id, // For compatibility with frontend
      title: offer.title,
      description: offer.description,
      salary: offer.salary ? `${offer.salary} MAD` : "À négocier",
      companyId: offer.Company?.name || "Entreprise non spécifiée",
      secteur: offer.Company?.sector || "Non spécifié",
      website: offer.Company?.websiteUrl || "#",
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      // Include full company details if needed
      companyDetails: offer.Company ? {
        id: offer.Company.id,
        name: offer.Company.name,
        description: offer.Company.description,
        sector: offer.Company.sector,
        websiteUrl: offer.Company.websiteUrl,
        logoUrl: offer.Company.logoUrl,
        numEmployees: offer.Company.numEmployees
      } : null
    }));

    res.json({ success: true, offers: transformedOffers });
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id, { include: Company });
    if (!offer) return res.status(404).json({ success: false, msg: 'Offre non trouvée' });

    // ✅ Transform single offer data
    const transformedOffer = {
      id: offer.id,
      _id: offer.id,
      title: offer.title,
      description: offer.description,
      salary: offer.salary ? `${offer.salary} MAD` : "À négocier",
      companyId: offer.Company?.name || "Entreprise non spécifiée",
      secteur: offer.Company?.sector || "Non spécifié",
      website: offer.Company?.websiteUrl || "#",
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      companyDetails: offer.Company ? {
        id: offer.Company.id,
        name: offer.Company.name,
        description: offer.Company.description,
        sector: offer.Company.sector,
        websiteUrl: offer.Company.websiteUrl,
        logoUrl: offer.Company.logoUrl,
        numEmployees: offer.Company.numEmployees
      } : null
    };

    res.json({ success: true, offer: transformedOffer });
  } catch (err) {
    console.error('Error fetching offer:', err);
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    
    // ✅ Fetch the created offer with company details
    const offerWithCompany = await Offer.findByPk(offer.id, { include: Company });
    
    const transformedOffer = {
      id: offerWithCompany.id,
      _id: offerWithCompany.id,
      title: offerWithCompany.title,
      description: offerWithCompany.description,
      salary: offerWithCompany.salary ? `${offerWithCompany.salary} MAD` : "À négocier",
      companyId: offerWithCompany.Company?.name || "Entreprise non spécifiée",
      secteur: offerWithCompany.Company?.sector || "Non spécifié",
      website: offerWithCompany.Company?.websiteUrl || "#",
      createdAt: offerWithCompany.createdAt,
      updatedAt: offerWithCompany.updatedAt,
      companyDetails: offerWithCompany.Company
    };

    res.status(201).json({ success: true, offer: transformedOffer });
  } catch (err) {
    console.error('Error creating offer:', err);
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id, { include: Company });
    if (!offer) return res.status(404).json({ success: false, msg: 'Offre non trouvée' });

    await offer.update(req.body);
    
    // ✅ Reload to get updated data with company
    await offer.reload({ include: Company });

    const transformedOffer = {
      id: offer.id,
      _id: offer.id,
      title: offer.title,
      description: offer.description,
      salary: offer.salary ? `${offer.salary} MAD` : "À négocier",
      companyId: offer.Company?.name || "Entreprise non spécifiée",
      secteur: offer.Company?.sector || "Non spécifié",
      website: offer.Company?.websiteUrl || "#",
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      companyDetails: offer.Company
    };

    res.json({ success: true, offer: transformedOffer });
  } catch (err) {
    console.error('Error updating offer:', err);
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ success: false, msg: 'Offre non trouvée' });

    await offer.destroy();
    res.json({ success: true, msg: 'Offre supprimée' });
  } catch (err) {
    console.error('Error deleting offer:', err);
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};