const express = require("express");
const router = express.Router();
const FeedbackController = require("../controllers/validations/feedbackController");
const { authorize } = require('../middleware/authMiddleware');

// Create feedback or reply
router.post("/", authorize(), FeedbackController.createFeedback);

// Get feedback for an item
router.get("/", authorize(), FeedbackController.getFeedbackForItem);

// Get feedback for a specific user
router.get("/user/:userId", authorize(), FeedbackController.getFeedbackForUser);

module.exports = router; 