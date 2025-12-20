const { PlanVersion, Stand, Company } = require('../models');

// GET /api/plans - Liste toutes les versions
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await PlanVersion.findAll({
            order: [['year', 'DESC']],
            include: [
                {
                    model: Stand,
                    as: 'stands',
                    attributes: ['id'],
                },
            ],
        });

        const plansWithCount = plans.map((plan) => ({
            id: plan.id,
            year: plan.year,
            imageUrl: plan.imageUrl,
            imageWidth: plan.imageWidth,
            imageHeight: plan.imageHeight,
            isActive: plan.isActive,
            standsCount: plan.stands.length,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
        }));

        res.json({ success: true, data: plansWithCount });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// GET /api/plans/active - Récupère le plan actif (pour l'app mobile)
exports.getActivePlan = async (req, res) => {
    try {
        const activePlan = await PlanVersion.findOne({
            where: { isActive: true },
            include: [
                {
                    model: Stand,
                    as: 'stands',
                    include: [
                        {
                            model: Company,
                            as: 'company',
                            attributes: ['id', 'name', 'sector', 'description', 'websiteUrl', 'logoUrl'],
                        },
                    ],
                },
            ],
        });

        if (!activePlan) {
            return res.status(404).json({ success: false, msg: 'Aucun plan actif trouvé' });
        }

        // Format pour l'app mobile
        const response = {
            imageUrl: activePlan.imageUrl,
            year: activePlan.year,
            stands: activePlan.stands.map((stand) => ({
                id: stand.id,
                number: stand.standNumber,
                x: parseFloat(stand.xPercent),
                y: parseFloat(stand.yPercent),
                w: parseFloat(stand.wPercent),
                h: parseFloat(stand.hPercent),
                company_name: stand.company?.name || '',
                companyDetails: stand.company
                    ? {
                        id: stand.company.id,
                        name: stand.company.name,
                        field: stand.company.sector,
                        details: stand.company.description,
                        website: stand.company.websiteUrl,
                        logo: stand.company.logoUrl,
                    }
                    : null,
            })),
        };

        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// POST /api/plans - Créer une nouvelle version
exports.createPlan = async (req, res) => {
    try {
        const { year, imageUrl, imageWidth, imageHeight } = req.body;

        const existingPlan = await PlanVersion.findOne({ where: { year } });
        if (existingPlan) {
            return res.status(400).json({ success: false, msg: 'Un plan existe déjà pour cette année' });
        }

        const newPlan = await PlanVersion.create({
            year,
            imageUrl: imageUrl || null,
            imageWidth: imageWidth || 1725,
            imageHeight: imageHeight || 1725,
            isActive: false,
        });

        res.status(201).json({ success: true, data: newPlan });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// PATCH /api/plans/:id/activate - Activer un plan (et désactiver les autres)
exports.activatePlan = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await PlanVersion.findByPk(id);
        if (!plan) {
            return res.status(404).json({ success: false, msg: 'Plan non trouvé' });
        }

        // Désactiver tous les autres plans
        await PlanVersion.update({ isActive: false }, { where: {} });

        // Activer le plan sélectionné
        plan.isActive = true;
        await plan.save();

        res.json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// PATCH /api/plans/:id - Modifier un plan
exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, imageWidth, imageHeight } = req.body;

        const plan = await PlanVersion.findByPk(id);
        if (!plan) {
            return res.status(404).json({ success: false, msg: 'Plan non trouvé' });
        }

        // Mettre à jour uniquement les champs fournis
        if (year !== undefined) plan.year = year;
        if (imageWidth !== undefined) plan.imageWidth = imageWidth;
        if (imageHeight !== undefined) plan.imageHeight = imageHeight;

        await plan.save();

        res.json({ success: true, data: plan, msg: 'Plan mis à jour' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// POST /api/plans/:id/stands - Créer un stand
exports.createStand = async (req, res) => {
    try {
        const { id } = req.params;
        const { standNumber, xPercent, yPercent, wPercent, hPercent, companyId } = req.body;

        const plan = await PlanVersion.findByPk(id);
        if (!plan) {
            return res.status(404).json({ success: false, msg: 'Plan non trouvé' });
        }

        const newStand = await Stand.create({
            planVersionId: id,
            standNumber,
            xPercent,
            yPercent,
            wPercent,
            hPercent,
            companyId: companyId || null,
        });

        res.status(201).json({ success: true, data: newStand });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// GET /api/plans/:id/stands - Liste les stands d'un plan
exports.getStandsByPlan = async (req, res) => {
    try {
        const { id } = req.params;

        const stands = await Stand.findAll({
            where: { planVersionId: id },
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['id', 'name', 'sector'],
                },
            ],
            order: [['standNumber', 'ASC']],
        });

        res.json({ success: true, data: stands });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// PATCH /api/stands/:id - Modifier un stand
exports.updateStand = async (req, res) => {
    try {
        const { id } = req.params;
        const { standNumber, xPercent, yPercent, wPercent, hPercent, companyId } = req.body;

        const stand = await Stand.findByPk(id);
        if (!stand) {
            return res.status(404).json({ success: false, msg: 'Stand non trouvé' });
        }

        if (standNumber !== undefined) stand.standNumber = standNumber;
        if (xPercent !== undefined) stand.xPercent = xPercent;
        if (yPercent !== undefined) stand.yPercent = yPercent;
        if (wPercent !== undefined) stand.wPercent = wPercent;
        if (hPercent !== undefined) stand.hPercent = hPercent;
        if (companyId !== undefined) stand.companyId = companyId;

        await stand.save();

        res.json({ success: true, data: stand });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// DELETE /api/stands/:id - Supprimer un stand
exports.deleteStand = async (req, res) => {
    try {
        const { id } = req.params;

        const stand = await Stand.findByPk(id);
        if (!stand) {
            return res.status(404).json({ success: false, msg: 'Stand non trouvé' });
        }

        await stand.destroy();

        res.json({ success: true, msg: 'Stand supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// DELETE /api/plans/:id - Supprimer un plan
exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await PlanVersion.findByPk(id);
        if (!plan) {
            return res.status(404).json({ success: false, msg: 'Plan non trouvé' });
        }

        // Ne pas supprimer le plan actif
        if (plan.isActive) {
            return res.status(400).json({
                success: false,
                msg: 'Impossible de supprimer le plan actif. Activez un autre plan d\'abord.'
            });
        }

        // Ne pas supprimer le dernier plan
        const totalPlans = await PlanVersion.count();
        if (totalPlans <= 1) {
            return res.status(400).json({
                success: false,
                msg: 'Impossible de supprimer le dernier plan. Il doit toujours y avoir au moins un plan.'
            });
        }

        await plan.destroy();

        res.json({ success: true, msg: 'Plan supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// DELETE /api/plans/:id/stands - Supprimer tous les stands d'un plan
exports.deleteAllStands = async (req, res) => {
    console.log('🔴 deleteAllStands appelé - planId:', req.params.id);
    try {
        const { id: planId } = req.params;

        const plan = await PlanVersion.findByPk(planId);
        if (!plan) {
            return res.status(404).json({ success: false, msg: 'Plan non trouvé' });
        }

        const deletedCount = await Stand.destroy({
            where: { planVersionId: planId }
        });

        console.log(`✅ ${deletedCount} stands supprimés`);

        res.json({
            success: true,
            msg: `${deletedCount} stand(s) supprimé(s)`,
            deletedCount
        });
    } catch (error) {
        console.error('❌ Erreur deleteAllStands:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// POST /api/plans/:id/upload-image - Upload image du plan
exports.uploadPlanImage = async (req, res) => {
    try {
        const { id: planId } = req.params;

        if (!req.file) {
            return res.status(400).json({ success: false, msg: 'Aucune image fournie' });
        }

        const plan = await PlanVersion.findByPk(planId);
        if (!plan) {
            // Supprimer le fichier uploadé si le plan n'existe pas
            const fs = require('fs');
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ success: false, msg: 'Plan non trouvé' });
        }

        // Construire l'URL de l'image
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/plans/${req.file.filename}`;

        // Mettre à jour le plan avec la nouvelle URL
        plan.imageUrl = imageUrl;
        await plan.save();

        res.json({
            success: true,
            msg: 'Image uploadée avec succès',
            data: {
                imageUrl: imageUrl,
                filename: req.file.filename
            }
        });
    } catch (error) {
        console.error('Erreur upload image:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// POST /api/plans/:id/import-csv - Importer des stands depuis un CSV
exports.importCsvStands = async (req, res) => {
    const Papa = require('papaparse');
    const fs = require('fs');

    try {
        const { id: planId } = req.params;

        if (!req.file) {
            return res.status(400).json({ success: false, msg: 'Aucun fichier CSV fourni' });
        }

        const plan = await PlanVersion.findByPk(planId);
        if (!plan) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ success: false, msg: 'Plan non trouvé' });
        }

        const { imageWidth, imageHeight } = plan;
        const csvContent = fs.readFileSync(req.file.path, 'utf8');

        const parseResult = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false
        });

        if (parseResult.errors.length > 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                msg: 'Erreur lors du parsing du CSV',
                errors: parseResult.errors
            });
        }

        const rows = parseResult.data;
        const errors = [];
        const warnings = [];
        const standsToCreate = [];

        // Charger toutes les entreprises pour la recherche
        const allCompanies = await Company.findAll();
        const companyMap = new Map();
        allCompanies.forEach(c => {
            const normalizedName = c.name.toLowerCase().trim();
            companyMap.set(normalizedName, c.id);
        });

        // Valider et convertir chaque ligne
        rows.forEach((row, index) => {
            const lineNumber = index + 2;

            if (!row.label || !row.x || !row.y || !row.width || !row.height) {
                errors.push({
                    line: lineNumber,
                    error: 'Colonnes manquantes (label, x, y, width, height requis)'
                });
                return;
            }

            const x = parseFloat(row.x);
            const y = parseFloat(row.y);
            const width = parseFloat(row.width);
            const height = parseFloat(row.height);

            if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
                errors.push({
                    line: lineNumber,
                    error: 'Valeurs numériques invalides',
                    data: row
                });
                return;
            }

            const xPercent = (x / imageWidth) * 100;
            const yPercent = (y / imageHeight) * 100;
            const wPercent = (width / imageWidth) * 100;
            const hPercent = (height / imageHeight) * 100;

            // Déterminer la catégorie (par défaut: Entreprise)
            const category = row.category ? row.category.trim() : 'Entreprise';

            // Rechercher l'entreprise UNIQUEMENT si c'est un stand de type "Entreprise"
            let companyId = null;
            if (category.toLowerCase() === 'entreprise' && row.company_name && row.company_name.trim()) {
                const normalizedCompanyName = row.company_name.toLowerCase().trim();
                companyId = companyMap.get(normalizedCompanyName);

                if (!companyId) {
                    warnings.push({
                        line: lineNumber,
                        warning: `Entreprise "${row.company_name}" non trouvée`,
                        standLabel: row.label
                    });
                }
            }

            standsToCreate.push({
                standNumber: row.label,
                xPercent: xPercent.toFixed(2),
                yPercent: yPercent.toFixed(2),
                wPercent: wPercent.toFixed(2),
                hPercent: hPercent.toFixed(2),
                planVersionId: planId,
                companyId: companyId,
                category: category  // Stocker la catégorie
            });
        });

        if (errors.length > 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                msg: `${errors.length} erreur(s) détectée(s) dans le CSV`,
                errors
            });
        }

        const createdStands = await Stand.bulkCreate(standsToCreate, {
            validate: true
        });

        const standsWithCompany = createdStands.filter(s => s.companyId !== null).length;

        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            msg: `${createdStands.length} stand(s) importé(s) avec succès`,
            data: {
                standsCreated: createdStands.length,
                standsWithCompany: standsWithCompany,
                standsWithoutCompany: createdStands.length - standsWithCompany,
                planId: planId,
                warnings: warnings.length > 0 ? warnings : undefined
            }
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('Erreur import CSV:', error);
        res.status(500).json({
            success: false,
            msg: 'Erreur lors de l\'import du CSV',
            error: error.message
        });
    }
};
