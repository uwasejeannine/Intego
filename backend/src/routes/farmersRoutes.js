const express = require("express");
const {
  RegionController,
  CooperativeController,
  FarmerController,
} = require("../controllers/validations/farmersController");
const { authorize } = require("../middleware/authMiddleware");

const ROLES = ["admin", "districtAdministrator", "sectorCoordinator"];

// Region Routes
const regionRouter = express.Router();

regionRouter.get("/", authorize(...ROLES), RegionController.getAllRegions);
regionRouter.get("/:id", authorize(...ROLES), RegionController.getRegionById);
regionRouter.post("/", authorize("admin"), RegionController.createRegion);
regionRouter.put("/:id", authorize("admin"), RegionController.updateRegion);
regionRouter.delete("/:id", authorize("admin"), RegionController.deleteRegion);

// Cooperative Routes
const cooperativeRouter = express.Router();

cooperativeRouter.get("/", authorize(...ROLES), CooperativeController.getAllCooperatives);
cooperativeRouter.get("/:id", authorize(...ROLES), CooperativeController.getCooperativeById);
cooperativeRouter.post("/", authorize("admin", "sectorCoordinator"), CooperativeController.createCooperative);
cooperativeRouter.put("/:id", authorize("admin", "sectorCoordinator"), CooperativeController.updateCooperative);
cooperativeRouter.delete("/:id", authorize("admin"), CooperativeController.deleteCooperative);

// Individual Farmer Routes
const farmerRouter = express.Router();

// Stats and special routes (must come before /:id routes)
farmerRouter.get("/stats", authorize(...ROLES), FarmerController.getFarmerStats);
farmerRouter.get("/type/:farmer_type", authorize(...ROLES), FarmerController.getFarmersByType);

// CRUD routes
farmerRouter.get("/", authorize(...ROLES), FarmerController.getAllFarmers);
farmerRouter.get("/:id", authorize(...ROLES), FarmerController.getFarmerById);
farmerRouter.post("/", authorize("admin", "sectorCoordinator"), FarmerController.createFarmer);
farmerRouter.put("/:id", authorize("admin", "sectorCoordinator"), FarmerController.updateFarmer);
farmerRouter.delete("/:id", authorize("admin", "sectorCoordinator"), FarmerController.deleteFarmer);

// Main Farmers Routes (exported as single router)
const farmersRouter = express.Router();

farmersRouter.use("/regions", regionRouter);
farmersRouter.use("/cooperatives", cooperativeRouter);
farmersRouter.use("/individual", farmerRouter);

// Direct farmer routes (for simpler access)
farmersRouter.get("/", authorize(...ROLES), FarmerController.getAllFarmers);
farmersRouter.get("/stats", authorize(...ROLES), FarmerController.getFarmerStats);
farmersRouter.post("/", authorize("admin", "sectorCoordinator"), FarmerController.createFarmer);

module.exports = farmersRouter;