const express = require("express");
const router = express.Router();
const userController = require("../controllers/validations/userController");
const upload = require("../middleware/fileUploads");

router.get("/users", userController.getAllUsers);
router.post("/create", userController.createUser);
router.get("/users/:id", userController.getUserById);
router.put(
  "/users/:id",
  upload.single("profileImage"),
  userController.updateUser,
); // Add upload middleware
router.put("/users", userController.updateMultipleUsers);
router.delete("/users/:id", userController.deleteUser);
router.delete("/users", userController.deleteMultipleUsers);

module.exports = router;
