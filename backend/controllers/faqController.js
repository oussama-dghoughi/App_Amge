const Faq = require('../models/Faq');

// Récupérer toutes les FAQs (pour l'app et l'admin)
exports.getAllFaqs = async (req, res) => {
    try {
        const { isAdmin } = req.query;

        // Si c'est pour l'app publique, on renvoie seulement les actives
        const whereClause = isAdmin === 'true' ? {} : { isActive: true };

        const faqs = await Faq.findAll({
            where: whereClause,
            order: [['order', 'ASC'], ['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            data: faqs,
        });
    } catch (error) {
        console.error('Erreur getAllFaqs:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des FAQ',
        });
    }
};

// Créer une nouvelle FAQ
exports.createFaq = async (req, res) => {
    try {
        const { question, answer, order } = req.body;

        const newFaq = await Faq.create({
            question,
            answer,
            order: order || 0,
        });

        res.status(201).json({
            success: true,
            data: newFaq,
        });
    } catch (error) {
        console.error('Erreur createFaq:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la FAQ',
        });
    }
};

// Mettre à jour une FAQ
exports.updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, order, isActive } = req.body;

        const faq = await Faq.findByPk(id);

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ non trouvée',
            });
        }

        await faq.update({
            question,
            answer,
            order,
            isActive
        });

        res.status(200).json({
            success: true,
            data: faq,
        });
    } catch (error) {
        console.error('Erreur updateFaq:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
        });
    }
};

// Supprimer une FAQ
exports.deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;

        const faq = await Faq.findByPk(id);

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ non trouvée',
            });
        }

        await faq.destroy();

        res.status(200).json({
            success: true,
            message: 'FAQ supprimée avec succès',
        });
    } catch (error) {
        console.error('Erreur deleteFaq:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression',
        });
    }
};
