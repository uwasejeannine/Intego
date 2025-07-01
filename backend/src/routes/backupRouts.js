const express = require("express");
const router = express.Router();
const backupController = require("../controllers/validations/backupController");

router.get("/backups", backupController.getAllBackups);
router.get("/backups/:id", backupController.getBackupById);
router.post("/backups", backupController.createBackup);
router.put("/backups/:id", backupController.updateBackup);
router.delete("/backups/:id", backupController.deleteBackup);

module.exports = router;
