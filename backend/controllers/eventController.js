const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: events } = await Event.findAndCountAll({
      where,
      limit,
      offset,
      order: [["startDateTime", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: events.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      events,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    res.status(500).json({
      success: false,
      msg: "Erreur serveur lors de la récupération des événements",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        msg: "Événement non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    res.status(500).json({
      success: false,
      msg: "Erreur serveur lors de la récupération de l'événement",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Erreurs de validation",
        errors: errors.array(),
      });
    }

    const { title, description, startDateTime, endDateTime } = req.body;

    if (new Date(endDateTime) < new Date(startDateTime)) {
      return res.status(400).json({
        success: false,
        msg: "La date de fin doit être après la date de début",
      });
    }

    const event = await Event.create({
      title,
      description,
      startDateTime,
      endDateTime,
    });

    res.status(201).json({
      success: true,
      msg: "Événement créé avec succès",
      event,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    res.status(500).json({
      success: false,
      msg: "Erreur serveur lors de la création de l'événement",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Erreurs de validation",
        errors: errors.array(),
      });
    }

    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        msg: "Événement non trouvé",
      });
    }

    const { title, description, startDateTime, endDateTime } = req.body;

    const newStart = startDateTime
      ? new Date(startDateTime)
      : new Date(event.startDateTime);
    const newEnd = endDateTime
      ? new Date(endDateTime)
      : new Date(event.endDateTime);

    if (newEnd < newStart) {
      return res.status(400).json({
        success: false,
        msg: "La date de fin doit être après la date de début",
      });
    }

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (startDateTime !== undefined) event.startDateTime = startDateTime;
    if (endDateTime !== undefined) event.endDateTime = endDateTime;

    await event.save();

    res.status(200).json({
      success: true,
      msg: "Événement mis à jour avec succès",
      event,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    res.status(500).json({
      success: false,
      msg: "Erreur serveur lors de la mise à jour de l'événement",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        msg: "Événement non trouvé",
      });
    }

    await event.destroy();

    res.status(200).json({
      success: true,
      msg: "Événement supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    res.status(500).json({
      success: false,
      msg: "Erreur serveur lors de la suppression de l'événement",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
