const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PlanVersion = sequelize.define(
    'PlanVersion',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            validate: {
                min: 2020,
                max: 2100,
            },
        },
        imageUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        imageWidth: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1725,
        },
        imageHeight: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1725,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'plan_versions',
        timestamps: true,
    }
);

module.exports = PlanVersion;
