const express = require("express");
const router = express.Router();
const archiveController = require("../controllers/validations/archiveController");

router.get("/archives", archiveController.getAllArchives);
router.get("/archives/:id", archiveController.getArchiveById);
router.post("/archives", archiveController.createArchive);
router.put("/archives/:id", archiveController.updateArchive);
router.delete("/archives/:id", archiveController.deleteArchive);

module.exports = router;
