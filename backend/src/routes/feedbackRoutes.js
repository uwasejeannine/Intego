const express = require("express");
const router = express.Router();
const FeedbackController = require("../controllers/validations/feedbackController");

// Create feedback or reply
router.post("/", FeedbackController.createFeedback);
// Get feedback for an item
router.get("/", FeedbackController.getFeedbackForItem);

module.exports = router; 