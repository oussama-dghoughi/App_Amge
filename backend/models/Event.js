const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le titre est requis",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La date de début est requise",
        },
        isDate: {
          msg: "La date de début doit être valide",
        },
      },
    },
    endDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La date de fin est requise",
        },
        isDate: {
          msg: "La date de fin doit être valide",
        },
        isAfterStart(value) {
          if (value && this.startDateTime && value < this.startDateTime) {
            throw new Error("La date de fin doit être après la date de début");
          }
        },
      },
    },
  },
  {
    tableName: "events",
    timestamps: true,
  }
);

module.exports = Event;
