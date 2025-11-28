const Offer = require('../models/Offer');
const Company = require('../models/Company');

exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll({
      include: [{ model: Company }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, offers });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id, { include: Company });
    if (!offer) return res.status(404).json({ success: false, msg: 'Offre non trouvée' });

    res.json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ success: false, msg: 'Offre non trouvée' });

    await offer.update(req.body);
    res.json({ success: true, offer });
  } catch (err) {
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
    res.status(500).json({ success: false, msg: 'Erreur serveur' });
  }
};
