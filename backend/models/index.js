const Company = require('./Company');
const Event = require('./Event');
const Offer = require('./Offer');
const User = require('./User');
const PlanVersion = require('./PlanVersion');
const Stand = require('./Stand');

// Relations existantes (si nécessaire)
// ...

// Relations pour le Plan Interactif
PlanVersion.hasMany(Stand, {
    foreignKey: 'planVersionId',
    as: 'stands',
    onDelete: 'CASCADE',
});

Stand.belongsTo(PlanVersion, {
    foreignKey: 'planVersionId',
    as: 'planVersion',
});

Stand.belongsTo(Company, {
    foreignKey: 'companyId',
    as: 'company',
    onDelete: 'SET NULL',
});

Company.hasMany(Stand, {
    foreignKey: 'companyId',
    as: 'stands',
});

module.exports = {
    Company,
    Event,
    Offer,
    User,
    PlanVersion,
    Stand,
};
