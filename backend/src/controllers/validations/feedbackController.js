const { Feedback, User } = require("../../../models/index");

class FeedbackController {
  // Create feedback or reply
  static async createFeedback(req, res) {
    try {
      const { section, itemId, fromUserId, toUserId, message, parentId } = req.body;
      if (!section || !itemId || !fromUserId || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create feedback
      const feedback = await Feedback.create({
        section,
        itemId,
        fromUserId,
        toUserId: toUserId || null,
        message,
        parentId: parentId || null
      });

      // Return created feedback with user info
      const feedbackWithUser = await Feedback.findOne({
        where: { id: feedback.id },
        include: [
          { model: User, as: "fromUser", attributes: ["id", "username", "first_name", "last_name"] },
          { model: User, as: "toUser", attributes: ["id", "username", "first_name", "last_name"] },
        ]
      });

      res.status(201).json({
        message: "Feedback submitted",
        feedback: feedbackWithUser
      });
    } catch (error) {
      console.error('Error creating feedback:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get all feedback for an item (with threads)
  static async getFeedbackForItem(req, res) {
    try {
      const { section, itemId } = req.query;
      
      // Build where clause
      const whereClause = {};
      if (section) whereClause.section = section;
      if (itemId) whereClause.itemId = itemId;
      
      // If no filters provided, return error
      if (Object.keys(whereClause).length === 0) {
        return res.status(400).json({ message: "Missing required query parameters" });
      }

      // Get only root feedback (no parentId)
      whereClause.parentId = null;

      const feedbacks = await Feedback.findAll({
        where: whereClause,
        include: [
          {
            model: Feedback,
            as: "replies",
            include: [
              { model: User, as: "fromUser", attributes: ["id", "username", "first_name", "last_name"] },
              { model: User, as: "toUser", attributes: ["id", "username", "first_name", "last_name"] }
            ]
          },
          { model: User, as: "fromUser", attributes: ["id", "username", "first_name", "last_name"] },
          { model: User, as: "toUser", attributes: ["id", "username", "first_name", "last_name"] }
        ],
        order: [
          ["createdAt", "DESC"],
          [{ model: Feedback, as: "replies" }, "createdAt", "ASC"]
        ]
      });

      res.status(200).json({
        message: "Feedback fetched successfully",
        feedbacks
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get feedback for a specific user
  static async getFeedbackForUser(req, res) {
    try {
      console.log('Getting feedback for user:', req.params.userId);
      
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      const feedbacks = await Feedback.findAll({
        where: { toUserId: userId, parentId: null },
        include: [
          {
            model: Feedback,
            as: "replies",
            include: [
              { model: User, as: "fromUser", attributes: ["id", "username", "first_name", "last_name"] },
              { model: User, as: "toUser", attributes: ["id", "username", "first_name", "last_name"] }
            ]
          },
          { model: User, as: "fromUser", attributes: ["id", "username", "first_name", "last_name"] },
          { model: User, as: "toUser", attributes: ["id", "username", "first_name", "last_name"] }
        ],
        order: [
          ["createdAt", "DESC"],
          [{ model: Feedback, as: "replies" }, "createdAt", "ASC"]
        ]
      });

      console.log('Found feedbacks:', feedbacks.length);

      res.status(200).json({
        message: "User feedback fetched successfully",
        feedbacks
      });
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = FeedbackController; 