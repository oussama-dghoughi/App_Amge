const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Company = sequelize.define(
  'Company',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    sector: DataTypes.STRING,
    websiteUrl: DataTypes.STRING,
    logoUrl: DataTypes.STRING,
    numEmployees: DataTypes.INTEGER,
  },
  {
    tableName: 'companies',
    timestamps: true,
  }
);

module.exports = Company;
