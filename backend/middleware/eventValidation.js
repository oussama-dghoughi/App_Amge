const { body } = require("express-validator");

// Validations for event creation
const validateEventCreate = [
  body("title").trim().notEmpty().withMessage("Le titre est requis"),
  body("startDateTime")
    .notEmpty()
    .withMessage("La date de début est requise")
    .isISO8601()
    .withMessage("La date de début doit être valide"),
  body("endDateTime")
    .notEmpty()
    .withMessage("La date de fin est requise")
    .isISO8601()
    .withMessage("La date de fin doit être valide"),
];

// Validations for event update
const validateEventUpdate = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Le titre ne peut pas être vide"),
  body("description")
    .optional()
    .isString()
    .withMessage("La description doit être une chaîne de caractères"),
  body("startDateTime")
    .optional()
    .isISO8601()
    .withMessage("La date de début doit être valide"),
  body("endDateTime")
    .optional()
    .isISO8601()
    .withMessage("La date de fin doit être valide"),
];

module.exports = { validateEventCreate, validateEventUpdate };
