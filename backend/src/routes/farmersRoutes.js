const express = require("express");
const {
  RegionController,
  CooperativeController,
  FarmerController,
} = require("../controllers/validations/farmersController");

// Region Routes
const regionRouter = express.Router();

regionRouter.get("/", RegionController.getAllRegions);
regionRouter.get("/:id", RegionController.getRegionById);
regionRouter.post("/", RegionController.createRegion);
regionRouter.put("/:id", RegionController.updateRegion);
regionRouter.delete("/:id", RegionController.deleteRegion);

// Cooperative Routes
const cooperativeRouter = express.Router();

cooperativeRouter.get("/", CooperativeController.getAllCooperatives);
cooperativeRouter.get("/:id", CooperativeController.getCooperativeById);
cooperativeRouter.post("/", CooperativeController.createCooperative);
cooperativeRouter.put("/:id", CooperativeController.updateCooperative);
cooperativeRouter.delete("/:id", CooperativeController.deleteCooperative);

// Individual Farmer Routes
const farmerRouter = express.Router();

// Stats and special routes (must come before /:id routes)
farmerRouter.get("/stats", FarmerController.getFarmerStats);
farmerRouter.get("/type/:farmer_type", FarmerController.getFarmersByType);

// CRUD routes
farmerRouter.get("/", FarmerController.getAllFarmers);
farmerRouter.get("/:id", FarmerController.getFarmerById);
farmerRouter.post("/", FarmerController.createFarmer);
farmerRouter.put("/:id", FarmerController.updateFarmer);
farmerRouter.delete("/:id", FarmerController.deleteFarmer);

// Main Farmers Routes (exported as single router)
const farmersRouter = express.Router();

farmersRouter.use("/regions", regionRouter);
farmersRouter.use("/cooperatives", cooperativeRouter);
farmersRouter.use("/individual", farmerRouter);

// Direct farmer routes (for simpler access)
farmersRouter.get("/", FarmerController.getAllFarmers);
farmersRouter.get("/stats", FarmerController.getFarmerStats);
farmersRouter.post("/", FarmerController.createFarmer);

module.exports = farmersRouter;