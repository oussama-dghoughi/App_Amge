const { sequelize } = require('../config/database');
const Faq = require('../models/Faq');

const initialFaqs = [
    {
        question: "Qu'est-ce que le FHM ?",
        answer: "Le Forum Horizons Maroc (FHM) a pour vocation de promouvoir le marché du travail marocain auprès des étudiants et jeunes diplômés des Grandes Écoles et Universités françaises.",
        order: 1,
        isActive: true
    },
    {
        question: "Où et quand se déroulera le FHM 2026 ?",
        answer: "Le FHM 2026 aura lieu le 01/06/2026 à l'Espace Champerret, 6 Rue Jean Ostreicher, 75017 Paris.",
        order: 2,
        isActive: true
    },
    {
        question: "Qui peut participer au FHM ?",
        answer: "Étudiants, jeunes cadres diplômés et professionnels expérimentés sont les bienvenus pour découvrir les opportunités professionnelles.",
        order: 3,
        isActive: true
    },
    {
        question: "Comment puis-je m'inscrire au FHM ?",
        answer: "Vous pouvez vous inscrire directement via l'application FHM en créant votre profil dans la section inscription.",
        order: 4,
        isActive: true
    },
    {
        question: "Quels types d'entreprises participent ?",
        answer: "Les entreprises participantes couvrent divers secteurs, notamment la banque, l'assurance, le conseil, l'ingénierie, et la technologie.",
        order: 5,
        isActive: true
    }
];

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('🔌 Connexion à la base de données réussie.');

        // Synchroniser les modèles (créer les tables si elles n'existent pas)
        await sequelize.sync();

        // --- SEED FAQ ---
        const faqCount = await Faq.count();
        if (faqCount === 0) {
            await Faq.bulkCreate(initialFaqs);
            console.log('✅ FAQ initialisée avec succès (5 questions).');
        } else {
            console.log('ℹ️ La table FAQ contient déjà des données. Ignoré.');
        }

        // Ici on pourra ajouter d'autres seeds (Entreprises, Events...) plus tard

        console.log('🌱 Base de données initialisée !');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seeding :', error);
        process.exit(1);
    }
};

seedData();
