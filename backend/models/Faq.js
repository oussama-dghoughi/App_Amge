const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Faq = sequelize.define(
    'Faq',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        answer: {
            type: DataTypes.TEXT, // Utilisation de TEXT pour les réponses longues
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0, // Pour gérer l'ordre d'affichage
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'faqs',
        timestamps: true,
    }
);

module.exports = Faq;
