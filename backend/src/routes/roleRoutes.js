const express = require("express");
const router = express.Router();
const roleController = require("../controllers/validations/roleController");
const { authorize } = require('../middleware/authMiddleware');

// Public route to get all roles (needed for user registration)
router.get("/", authorize(), roleController.getAllRoles);

// Protected admin routes
router.get("/:id", authorize('admin'), roleController.getRoleById);
router.post("/", authorize('admin'), roleController.createRole);
router.put("/:id", authorize('admin'), roleController.updateRole);
router.delete("/:id", authorize('admin'), roleController.deleteRole);

module.exports = router;
