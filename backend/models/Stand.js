const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Stand = sequelize.define(
    'Stand',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        standNumber: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        xPercent: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        yPercent: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        wPercent: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        hPercent: {
            type: DataTypes.DECIMAL(8, 4),
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: 'Entreprise',
            comment: 'Type de stand: Entreprise, Service, Salle, Restauration, etc.',
        },
    },
    {
        tableName: 'stands',
        timestamps: true,
    }
);

module.exports = Stand;
