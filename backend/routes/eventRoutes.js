const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/auth");
const {
  validateEventCreate,
  validateEventUpdate,
} = require("../middleware/eventValidation");

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected routes
router.post("/", protect, authorize("admin"), validateEventCreate, createEvent);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateEventUpdate,
  updateEvent
);
router.delete("/:id", protect, authorize("admin"), deleteEvent);

module.exports = router;
