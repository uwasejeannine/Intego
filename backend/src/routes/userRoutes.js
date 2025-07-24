const express = require("express");
const router = express.Router();
const userController = require("../controllers/validations/userController");
const upload = require("../middleware/fileUploads");
const { authorize } = require("../middleware/authMiddleware");

router.get("/users", authorize("admin"), userController.getAllUsers);
router.post("/create", authorize("admin"), userController.createUser);
router.get("/users/:id", authorize("admin"), userController.getUserById);
router.put(
  "/users/:id",
  authorize("admin"),
  upload.single("profileImage"),
  userController.updateUser,
); // Add upload middleware
router.put("/users", authorize("admin"), userController.updateMultipleUsers);
router.delete("/users/:id", authorize("admin"), userController.deleteUser);
router.delete("/users", authorize("admin"), userController.deleteMultipleUsers);

module.exports = router;
