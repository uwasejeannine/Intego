const db = require("../../../models/index");
const { Region, Cooperative, Farmer } = db;
const { Op } = require("sequelize");

// Region Controller - FIXED VERSION
class RegionController {
  static async getAllRegions(req, res) {
    try {
      const { page = 1, limit = 10, isActive } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (req.districtId) {
        whereClause.id = req.districtId;
      } else if (req.sectorId) {
        // This assumes a direct relationship between region and sector, which doesn't exist yet.
        // This will need to be implemented properly.
        // For now, this will not filter by sector.
      }
      
      if (isActive !== undefined) {
        whereClause.is_active = isActive === 'true';
      }

      const regions = await Region.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: Farmer,
            as: "farmers",
            attributes: ['farmer_id', 'first_name', 'last_name', 'farmer_type'],
          },
          {
            model: Cooperative,
            as: "cooperatives",
            attributes: ['id', 'cooperative_name', 'number_of_farmers'],
          },
        ],
        order: [['region_name', 'ASC']],
      });

      res.status(200).json({
        message: "Regions fetched successfully",
        data: regions.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(regions.count / limit),
          totalItems: regions.count,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getRegionById(req, res) {
    const regionId = req.params.id;
    try {
      const region = await Region.findByPk(regionId, {
        include: [
          {
            model: Farmer,
            as: "farmers",
          },
          {
            model: Cooperative,
            as: "cooperatives",
          },
        ],
      });

      if (!region) {
        return res.status(404).json({ message: "Region not found" });
      }

      return res.status(200).json({
        message: "Region fetched successfully",
        data: region,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async createRegion(req, res) {
    try {
      const { region_name, region_code, description } = req.body;

      // Check if region with same name or code exists
      const existingRegion = await Region.findOne({
        where: {
          [Op.or]: [{ region_name }
            , { region_code }],
        },
      });

      if (existingRegion) {
        return res.status(400).json({
          message: "Region with the same name or code already exists",
        });
      }

      const newRegion = await Region.create({
        region_name,
        region_code: region_code.toUpperCase(),
        description,
      });

      return res.status(201).json({
        message: "Region created successfully",
        data: newRegion,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateRegion(req, res) {
    const regionId = req.params.id;
    try {
      const region = await Region.findByPk(regionId);

      if (!region) {
        return res.status(404).json({ message: "Region not found" });
      }

      const updatedRegion = await region.update(req.body);

      return res.status(200).json({
        message: "Region updated successfully",
        data: updatedRegion,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteRegion(req, res) {
    const regionId = req.params.id;
    try {
      const region = await Region.findByPk(regionId);

      if (!region) {
        return res.status(404).json({ message: "Region not found" });
      }

      // Check if region has associated farmers or cooperatives
      const farmerCount = await Farmer.count({ where: { region_id: regionId } });
      const cooperativeCount = await Cooperative.count({ where: { region_id: regionId } });

      if (farmerCount > 0 || cooperativeCount > 0) {
        return res.status(400).json({
          message: "Cannot delete region with associated farmers or cooperatives",
        });
      }

      await region.destroy();

      return res.status(200).json({
        message: "Region deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

// Cooperative Controller - FIXED VERSION
class CooperativeController {
  static async getAllCooperatives(req, res) {
    try {
      const { page = 1, limit = 10, regionId, isActive, search } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (req.districtId) {
        whereClause.region_id = req.districtId;
      } else if (req.sectorId) {
        // This assumes a direct relationship between cooperative and sector, which doesn't exist yet.
        // This will need to be implemented properly.
        // For now, this will not filter by sector.
      }
      
      if (regionId) whereClause.region_id = regionId;
      if (isActive !== undefined) whereClause.is_active = isActive === 'true';
      
      if (search) {
        whereClause[Op.or] = [
          { cooperative_name: { [Op.iLike]: `%${search}%` } },
          { location: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const cooperatives = await Cooperative.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['id', 'region_name', 'region_code'],
          },
          {
            model: Farmer,
            as: "farmers",
            attributes: ['farmer_id', 'first_name', 'last_name'],
          },
        ],
        order: [['cooperative_name', 'ASC']],
      });

      // Add parsed main crops to each cooperative
      const cooperativesWithParsedData = cooperatives.rows.map(coop => {
        const coopData = coop.toJSON();
        // Only call getMainCrops if the method exists
        if (typeof coop.getMainCrops === 'function') {
          coopData.mainCropsArray = coop.getMainCrops();
        }
        return coopData;
      });

      res.status(200).json({
        message: "Cooperatives fetched successfully",
        data: cooperativesWithParsedData,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(cooperatives.count / limit),
          totalItems: cooperatives.count,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getCooperativeById(req, res) {
    const cooperativeId = req.params.id;
    try {
      const cooperative = await Cooperative.findByPk(cooperativeId, {
        include: [
          {
            model: Region,
            as: "region",
          },
          {
            model: Farmer,
            as: "farmers",
          },
        ],
      });

      if (!cooperative) {
        return res.status(404).json({ message: "Cooperative not found" });
      }

      // Add computed fields
      const cooperativeData = cooperative.toJSON();
      // Only call getMainCrops if the method exists
      if (typeof cooperative.getMainCrops === 'function') {
        cooperativeData.mainCropsArray = cooperative.getMainCrops();
      }

      return res.status(200).json({
        message: "Cooperative fetched successfully",
        data: cooperativeData,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async createCooperative(req, res) {
    try {
      console.log('=== CREATE COOPERATIVE DEBUG ===');
      console.log('Raw request body:', JSON.stringify(req.body, null, 2));
      
      const {
        cooperative_name,
        location,
        number_of_farmers,
        total_land_size,
        contact_person_phone,
        contact_person_email,
        main_crops,
        region_id,
        is_active,
      } = req.body;
  
      console.log('Extracted values:');
      console.log('- number_of_farmers:', number_of_farmers, 'Type:', typeof number_of_farmers);
      console.log('- total_land_size:', total_land_size, 'Type:', typeof total_land_size);
      console.log('- region_id:', region_id, 'Type:', typeof region_id);
  
      // Check if cooperative with same name exists
      const existingCooperative = await Cooperative.findOne({
        where: { cooperative_name },
      });
  
      if (existingCooperative) {
        return res.status(400).json({
          message: "Cooperative with the same name already exists",
        });
      }
  
      // Verify region exists if provided
      if (region_id) {
        const region = await Region.findByPk(region_id);
        if (!region) {
          return res.status(400).json({ message: "Invalid region ID" });
        }
      }
  
      // Convert main_crops array to JSON string if it's an array
      let mainCropsString = main_crops;
      if (Array.isArray(main_crops)) {
        mainCropsString = JSON.stringify(main_crops);
      }
  
      // Explicit conversion and validation
      const processedNumberOfFarmers = number_of_farmers === undefined || number_of_farmers === null ? 0 : parseInt(number_of_farmers, 10);
      const processedTotalLandSize = total_land_size === undefined || total_land_size === null ? null : parseFloat(total_land_size);
      const processedRegionId = region_id === undefined || region_id === null ? null : parseInt(region_id, 10);
  
      console.log('Processed values:');
      console.log('- processedNumberOfFarmers:', processedNumberOfFarmers, 'Type:', typeof processedNumberOfFarmers);
      console.log('- processedTotalLandSize:', processedTotalLandSize, 'Type:', typeof processedTotalLandSize);
      console.log('- processedRegionId:', processedRegionId, 'Type:', typeof processedRegionId);
  
      // Validate processed values
      if (isNaN(processedNumberOfFarmers) || processedNumberOfFarmers < 0) {
        return res.status(400).json({
          message: "Invalid number_of_farmers. Must be a non-negative integer.",
          received: number_of_farmers,
          processed: processedNumberOfFarmers
        });
      }
  
      if (processedTotalLandSize !== null && (isNaN(processedTotalLandSize) || processedTotalLandSize < 0)) {
        return res.status(400).json({
          message: "Invalid total_land_size. Must be a non-negative number.",
          received: total_land_size,
          processed: processedTotalLandSize
        });
      }
  
      const cooperativeData = {
        cooperative_name,
        location,
        number_of_farmers: processedNumberOfFarmers,
        total_land_size: processedTotalLandSize,
        contact_person_phone,
        contact_person_email,
        main_crops: mainCropsString,
        region_id: processedRegionId,
        is_active: is_active !== undefined ? Boolean(is_active) : true,
      };
  
      console.log('Final cooperative data:', JSON.stringify(cooperativeData, null, 2));
  
      const newCooperative = await Cooperative.create(cooperativeData);
  
      console.log('Successfully created cooperative:', newCooperative.toJSON());
  
      return res.status(201).json({
        message: "Cooperative created successfully",
        data: newCooperative,
      });
    } catch (error) {
      console.error('Error creating cooperative:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value,
          valueType: typeof err.value
        }));
        
        console.log('Validation errors:', validationErrors);
        
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
          details: validationErrors
        });
      }
  
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateCooperative(req, res) {
    const cooperativeId = req.params.id;
    try {
      const cooperative = await Cooperative.findByPk(cooperativeId);

      if (!cooperative) {
        return res.status(404).json({ message: "Cooperative not found" });
      }

      // Handle main_crops conversion if it's an array
      const updateData = { ...req.body };
      if (Array.isArray(updateData.main_crops)) {
        updateData.main_crops = JSON.stringify(updateData.main_crops);
      }

      const updatedCooperative = await cooperative.update(updateData);

      return res.status(200).json({
        message: "Cooperative updated successfully",
        data: updatedCooperative,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteCooperative(req, res) {
    const cooperativeId = req.params.id;
    try {
      const cooperative = await Cooperative.findByPk(cooperativeId);

      if (!cooperative) {
        return res.status(404).json({ message: "Cooperative not found" });
      }

      // Check if cooperative has associated farmers
      const farmerCount = await Farmer.count({ where: { cooperative_id: cooperativeId } });

      if (farmerCount > 0) {
        return res.status(400).json({
          message: "Cannot delete cooperative with associated farmers. Please remove or reassign farmers first.",
        });
      }

      await cooperative.destroy();

      return res.status(200).json({
        message: "Cooperative deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

// Farmer Controller
class FarmerController {
static async getAllFarmers(req, res) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      region_id, 
      cooperative_id, 
      farmer_type,
      is_active,
      search 
    } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (req.districtId) {
      whereClause.region_id = req.districtId;
    } else if (req.sectorId) {
      // This assumes a direct relationship between farmer and sector, which doesn't exist yet.
      // This will need to be implemented properly.
      // For now, this will not filter by sector.
    }
    
    if (region_id) whereClause.region_id = region_id;
    if (cooperative_id) whereClause.cooperative_id = cooperative_id;
    if (farmer_type) whereClause.farmer_type = farmer_type;
    if (is_active !== undefined) whereClause.is_active = is_active === 'true';
    
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const farmers = await Farmer.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Region,
          as: "region",
          attributes: [
            'id', 
            'region_name',  // FIXED: Removed the alias that was causing the error
            'region_code'
          ],
        },
        {
          model: Cooperative,
          as: "cooperative",
          attributes: [
            'id', 
            'cooperative_name',  // FIXED: Removed the alias that was causing the error
            'location'
          ],
        },
      ],
      order: [['first_name', 'ASC'], ['last_name', 'ASC']],
    });

    // Add computed fields to each farmer
    const farmersWithComputedData = farmers.rows.map(farmer => {
      const farmerData = farmer.toJSON();
      farmerData.fullName = farmer.getFullName();
      farmerData.experienceLevel = farmer.getExperienceLevel();
      farmerData.primaryCropsArray = farmer.getPrimaryCrops();
      return farmerData;
    });

    res.status(200).json({
      message: "Farmers fetched successfully",
      data: farmersWithComputedData,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(farmers.count / limit),
        totalItems: farmers.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

  static async getFarmerById(req, res) {
    const farmerId = req.params.id;
    try {
      const farmer = await Farmer.findByPk(farmerId, {
        include: [
          {
            model: Region,
            as: "region",
          },
          {
            model: Cooperative,
            as: "cooperative",
          },
        ],
      });

      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }

      // Add computed fields
      const farmerData = farmer.toJSON();
      farmerData.fullName = farmer.getFullName();
      farmerData.experienceLevel = farmer.getExperienceLevel();
      farmerData.primaryCropsArray = farmer.getPrimaryCrops();

      return res.status(200).json({
        message: "Farmer fetched successfully",
        data: farmerData,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async createFarmer(req, res) {
    try {
      console.log('=== CREATE FARMER DEBUG ===');
      console.log('Raw request body:', JSON.stringify(req.body, null, 2));
  
      const {
        first_name,
        last_name,
        email,
        phone,
        region_id,
        address,
        farm_location,
        total_farm_area_hectares,
        years_experience,
        farmer_type,
        primary_crops,
        cooperative_id,
        registration_date,
      } = req.body;
  
      console.log('Extracted values:');
      console.log('- total_farm_area_hectares:', total_farm_area_hectares, 'Type:', typeof total_farm_area_hectares);
      console.log('- years_experience:', years_experience, 'Type:', typeof years_experience);
      console.log('- region_id:', region_id, 'Type:', typeof region_id);
      console.log('- cooperative_id:', cooperative_id, 'Type:', typeof cooperative_id);
  
      // Check if farmer with same email exists (if email provided)
      if (email) {
        const existingFarmer = await Farmer.findOne({
          where: { email },
        });
  
        if (existingFarmer) {
          return res.status(400).json({
            message: "Farmer with the same email already exists",
          });
        }
      }
  
      // Verify region exists if provided
      if (region_id) {
        const region = await Region.findByPk(region_id);
        if (!region) {
          return res.status(400).json({ message: "Invalid region ID" });
        }
      }
  
      // Verify cooperative exists if provided
      if (cooperative_id) {
        const cooperative = await Cooperative.findByPk(cooperative_id);
        if (!cooperative) {
          return res.status(400).json({ message: "Invalid cooperative ID" });
        }
      }
  
      // Convert primary_crops array to JSON string if it's an array
      let primaryCropsString = primary_crops;
      if (Array.isArray(primary_crops)) {
        primaryCropsString = JSON.stringify(primary_crops);
      }
  
      // Proper type conversion and validation
      const processedTotalFarmArea = total_farm_area_hectares === undefined || total_farm_area_hectares === null || total_farm_area_hectares === '' 
        ? null 
        : parseFloat(total_farm_area_hectares);
      
      const processedYearsExperience = years_experience === undefined || years_experience === null || years_experience === '' 
        ? null 
        : parseInt(years_experience, 10);
      
      const processedRegionId = region_id === undefined || region_id === null || region_id === '' 
        ? null 
        : parseInt(region_id, 10);
      
      const processedCooperativeId = cooperative_id === undefined || cooperative_id === null || cooperative_id === '' 
        ? null 
        : parseInt(cooperative_id, 10);
  
      console.log('Processed values:');
      console.log('- processedTotalFarmArea:', processedTotalFarmArea, 'Type:', typeof processedTotalFarmArea);
      console.log('- processedYearsExperience:', processedYearsExperience, 'Type:', typeof processedYearsExperience);
      console.log('- processedRegionId:', processedRegionId, 'Type:', typeof processedRegionId);
      console.log('- processedCooperativeId:', processedCooperativeId, 'Type:', typeof processedCooperativeId);
  
      // Validate processed values
      if (processedTotalFarmArea !== null && (isNaN(processedTotalFarmArea) || processedTotalFarmArea < 0)) {
        return res.status(400).json({
          message: "Invalid total farm area. Must be a non-negative number.",
          received: total_farm_area_hectares,
          processed: processedTotalFarmArea
        });
      }
  
      if (processedYearsExperience !== null && (isNaN(processedYearsExperience) || processedYearsExperience < 0)) {
        return res.status(400).json({
          message: "Invalid years of experience. Must be a non-negative integer.",
          received: years_experience,
          processed: processedYearsExperience
        });
      }
  
      const farmerData = {
        first_name,
        last_name,
        email,
        phone,
        region_id: processedRegionId,
        address,
        farm_location,
        total_farm_area_hectares: processedTotalFarmArea,
        years_experience: processedYearsExperience,
        farmer_type: farmer_type || 'smallholder',
        primary_crops: primaryCropsString,
        cooperative_id: processedCooperativeId,
        registration_date: registration_date || new Date(),
      };
  
      console.log('Final farmer data:', JSON.stringify(farmerData, null, 2));
  
      const newFarmer = await Farmer.create(farmerData);
  
      // If farmer is added to a cooperative, update the cooperative's farmer count
      if (processedCooperativeId) {
        await Cooperative.increment('number_of_farmers', { where: { id: processedCooperativeId } });
      }
  
      console.log('Successfully created farmer:', newFarmer.toJSON());
  
      return res.status(201).json({
        message: "Farmer created successfully",
        data: newFarmer,
      });
    } catch (error) {
      console.error('Error creating farmer:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value,
          valueType: typeof err.value
        }));
        
        console.log('Validation errors:', validationErrors);
        
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
          details: validationErrors
        });
      }
  
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateFarmer(req, res) {
    const farmerId = req.params.id;
    try {
      const farmer = await Farmer.findByPk(farmerId);

      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }

      const oldCooperativeId = farmer.cooperative_id;
      
      // Handle primary_crops conversion if it's an array
      const updateData = { ...req.body };
      if (Array.isArray(updateData.primary_crops)) {
        updateData.primary_crops = JSON.stringify(updateData.primary_crops);
      }

      const updatedFarmer = await farmer.update(updateData);

      // Update cooperative farmer counts if cooperative changed
      if (updateData.cooperative_id !== undefined && oldCooperativeId !== updateData.cooperative_id) {
        // Decrease count from old cooperative
        if (oldCooperativeId) {
          await Cooperative.decrement('number_of_farmers', { where: { id: oldCooperativeId } });
        }
        // Increase count for new cooperative
        if (updateData.cooperative_id) {
          await Cooperative.increment('number_of_farmers', { where: { id: updateData.cooperative_id } });
        }
      }

      return res.status(200).json({
        message: "Farmer updated successfully",
        data: updatedFarmer,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteFarmer(req, res) {
    const farmerId = req.params.id;
    try {
      const farmer = await Farmer.findByPk(farmerId);

      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }

      const cooperativeId = farmer.cooperative_id;

      await farmer.destroy();

      // Update cooperative farmer count if farmer was part of a cooperative
      if (cooperativeId) {
        await Cooperative.decrement('number_of_farmers', { where: { id: cooperativeId } });
      }

      return res.status(200).json({
        message: "Farmer deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get farmer statistics
  static async getFarmerStats(req, res) {
    try {
      const { region_id, cooperative_id } = req.query;
      
      const whereClause = { is_active: true };
      if (region_id) whereClause.region_id = region_id;
      if (cooperative_id) whereClause.cooperative_id = cooperative_id;

      const stats = await Promise.all([
        // Total active farmers
        Farmer.count({ where: whereClause }),
        // Farmers by type
        Farmer.count({ where: { ...whereClause, farmer_type: 'smallholder' } }),
        Farmer.count({ where: { ...whereClause, farmer_type: 'commercial' } }),
        Farmer.count({ where: { ...whereClause, farmer_type: 'cooperative' } }),
        Farmer.count({ where: { ...whereClause, farmer_type: 'estate' } }),
        // Total farm area
        Farmer.sum('total_farm_area_hectares', { where: whereClause }),
        // Farmers in cooperatives
        Farmer.count({ 
          where: { 
            ...whereClause, 
            cooperative_id: { [Op.not]: null } 
          } 
        }),
        // Average years of experience
        Farmer.findOne({
          where: whereClause,
          attributes: [
            [db.sequelize.fn('AVG', db.sequelize.col('years_experience')), 'avgExperience']
          ],
          raw: true
        }),
      ]);

      res.status(200).json({
        message: "Farmer statistics fetched successfully",
        data: {
          totalActiveFarmers: stats[0],
          farmersByType: {
            smallholder: stats[1],
            commercial: stats[2],
            cooperative: stats[3],
            estate: stats[4],
          },
          totalFarmArea: parseFloat(stats[5]) || 0,
          farmersInCooperatives: stats[6],
          averageExperience: parseFloat(stats[7]?.avgExperience) || 0,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get farmers by type (for dropdown/selection)
  static async getFarmersByType(req, res) {
    try {
      const { farmer_type } = req.params;
      
      const validTypes = ['smallholder', 'commercial', 'cooperative', 'estate'];
      if (!validTypes.includes(farmer_type)) {
        return res.status(400).json({ message: "Invalid farmer type" });
      }

      const farmers = await Farmer.findAll({
        where: { 
          farmer_type,
          is_active: true 
        },
        attributes: ['farmer_id', 'first_name', 'last_name', 'email', 'phone'],
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['region_name'],
          },
          {
            model: Cooperative,
            as: "cooperative",
            attributes: ['cooperative_name'],
          },
        ],
        order: [['first_name', 'ASC'], ['last_name', 'ASC']],
      });

      const farmersWithComputedData = farmers.map(farmer => {
        const farmerData = farmer.toJSON();
        farmerData.fullName = farmer.getFullName();
        return farmerData;
      });

      res.status(200).json({
        message: `${farmer_type} farmers fetched successfully`,
        data: farmersWithComputedData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = {
  RegionController,
  CooperativeController,
  FarmerController,
};