const express = require("express");
const usersRoutes = require("./userRoutes");
const archiveRoutes = require("./archiveRoutes");
const backupRouts = require("./backupRouts");
const reportRouts = require("./reportRouts");
const roleRoutes = require("./roleRoutes");
const authRouts = require("./authRoutes");
const farmersRoutes = require("./farmersRoutes");
const cropRoutes = require("./cropRoutes");
const hospitalRoutes = require("./hospitalRoutes");

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/archives", archiveRoutes);
router.use("/backups", backupRouts);
router.use("/reports", reportRouts);
router.use("/roles", roleRoutes);
router.use("/auth", authRouts);
router.use("/farmers", farmersRoutes); 
router.use("/crops", cropRoutes);
router.use("/hospital", hospitalRoutes);

module.exports = router;