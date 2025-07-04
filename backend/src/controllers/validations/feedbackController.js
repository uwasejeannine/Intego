const { Feedback, User } = require("../../../models/index");

class FeedbackController {
  // Create feedback or reply
  static async createFeedback(req, res) {
    try {
      const { section, itemId, fromUserId, toUserId, message, parentId } = req.body;
      if (!section || !itemId || !fromUserId || !toUserId || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const feedback = await Feedback.create({ section, itemId, fromUserId, toUserId, message, parentId });
      res.status(201).json({ message: "Feedback submitted", feedback });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get all feedback for an item (with threads)
  static async getFeedbackForItem(req, res) {
    try {
      const { section, itemId } = req.query;
      if (!section || !itemId) {
        return res.status(400).json({ message: "Missing section or itemId" });
      }
      const feedbacks = await Feedback.findAll({
        where: { section, itemId, parentId: null },
        include: [
          { model: Feedback, as: "replies", include: [{ model: User, as: "fromUser", attributes: ["id", "username", "first_name", "last_name"] }] },
          { model: User, as: "fromUser", attributes: ["id", "username", "first_name", "last_name"] },
          { model: User, as: "toUser", attributes: ["id", "username", "first_name", "last_name"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json({ feedbacks });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = FeedbackController; 