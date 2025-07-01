const express = require("express");
const {
  HealthFacilityController,
} = require("../controllers/validations/healthController");

// Health Facility Routes
const healthFacilityRouter = express.Router();

// Stats and special routes (must come before /:id routes)
healthFacilityRouter.get("/stats", HealthFacilityController.getHealthFacilityStats);
healthFacilityRouter.get("/dashboard-summary", HealthFacilityController.getFacilitiesDashboardSummary);
healthFacilityRouter.get("/critical", HealthFacilityController.getCriticalFacilities);
healthFacilityRouter.get("/nearby", HealthFacilityController.getNearbyFacilities);
healthFacilityRouter.get("/type/:facility_type", HealthFacilityController.getFacilitiesByType);

// CRUD routes
healthFacilityRouter.get("/", HealthFacilityController.getAllHealthFacilities);
healthFacilityRouter.get("/:id", HealthFacilityController.getHealthFacilityById);
healthFacilityRouter.post("/", HealthFacilityController.createHealthFacility);
healthFacilityRouter.put("/:id", HealthFacilityController.updateHealthFacility);
healthFacilityRouter.delete("/:id", HealthFacilityController.deleteHealthFacility);

// Main Health Routes (exported as single router)
const healthRouter = express.Router();

healthRouter.use("/facilities", healthFacilityRouter);

// Direct health facility routes (for simpler access)
healthRouter.get("/", HealthFacilityController.getAllHealthFacilities);
healthRouter.get("/stats", HealthFacilityController.getHealthFacilityStats);
healthRouter.get("/dashboard-summary", HealthFacilityController.getFacilitiesDashboardSummary);
healthRouter.post("/", HealthFacilityController.createHealthFacility);

module.exports = healthRouter;