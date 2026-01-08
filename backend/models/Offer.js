const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Company = require('./Company');

const Offer = sequelize.define(
  'Offer',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    salary: DataTypes.INTEGER,
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'companies', key: 'id' },
    },
  },
  {
    tableName: 'offers',
    timestamps: true,
  }
);

// Relation
Company.hasMany(Offer, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Offer.belongsTo(Company, { foreignKey: 'companyId' });

module.exports = Offer;
