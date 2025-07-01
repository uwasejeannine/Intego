const db = require("../../../models/index");
const { Crop } = db;
const { Op } = require("sequelize");

// Crop Controller
class CropController {
  static async getAllCrops(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        isActive, 
        search,
        crop_category,
        planting_season,
        water_requirements,
        soil_type,
        risk_level,
        suitable_for_smallholders,
        sort_by = 'crop_name',
        sort_order = 'ASC'
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (isActive !== undefined) {
        whereClause.is_active = isActive === 'true';
      }
      
      if (crop_category) {
        whereClause.crop_category = crop_category;
      }
      
      if (planting_season) {
        whereClause.planting_season = planting_season;
      }
      
      if (water_requirements) {
        whereClause.water_requirements = water_requirements;
      }
      
      if (soil_type) {
        whereClause.soil_type = soil_type;
      }
      
      if (risk_level) {
        whereClause.risk_level = risk_level;
      }
      
      if (suitable_for_smallholders !== undefined) {
        whereClause.suitable_for_smallholders = suitable_for_smallholders === 'true';
      }
      
      if (search) {
        whereClause[Op.or] = [
          { crop_name: { [Op.iLike]: `%${search}%` } },
          { crop_category: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Validate sort parameters
      const validSortFields = [
        'crop_name', 'crop_category', 'planting_season', 'growing_duration_days',
        'expected_yield_per_hectare', 'average_market_price_per_kg', 'water_requirements',
        'soil_type', 'risk_level', 'created_at', 'updated_at'
      ];
      
      const sortField = validSortFields.includes(sort_by) ? sort_by : 'crop_name';
      const sortDirection = sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      const crops = await Crop.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortField, sortDirection]],
      });

      // Add computed fields to each crop
      const cropsWithComputedData = crops.rows.map(crop => {
        const cropData = crop.toJSON();
        cropData.seasonDisplay = crop.getSeasonDisplay();
        cropData.categoryDisplay = crop.getCategoryDisplay();
        cropData.profitabilityScore = crop.getProfitabilityScore();
        cropData.growingPeriodMonths = crop.getGrowingPeriodMonths();
        cropData.waterDisplay = crop.getWaterDisplay();
        cropData.soilDisplay = crop.getSoilDisplay();
        return cropData;
      });

      res.status(200).json({
        message: "Crops fetched successfully",
        data: cropsWithComputedData,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(crops.count / limit),
          totalItems: crops.count,
          itemsPerPage: parseInt(limit),
        },
        filters: {
          isActive,
          crop_category,
          planting_season,
          water_requirements,
          soil_type,
          risk_level,
          suitable_for_smallholders,
          search,
          sort_by: sortField,
          sort_order: sortDirection
        }
      });
    } catch (error) {
      console.error('Error fetching crops:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getCropById(req, res) {
    const cropId = req.params.id;
    try {
      const crop = await Crop.findByPk(cropId);

      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }

      // Add computed fields
      const cropData = crop.toJSON();
      cropData.seasonDisplay = crop.getSeasonDisplay();
      cropData.categoryDisplay = crop.getCategoryDisplay();
      cropData.profitabilityScore = crop.getProfitabilityScore();
      cropData.growingPeriodMonths = crop.getGrowingPeriodMonths();
      cropData.waterDisplay = crop.getWaterDisplay();
      cropData.soilDisplay = crop.getSoilDisplay();

      return res.status(200).json({
        message: "Crop fetched successfully",
        data: cropData,
      });
    } catch (error) {
      console.error('Error fetching crop:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async createCrop(req, res) {
    try {
      const {
        crop_name,
        crop_category,
        planting_season,
        growing_duration_days,
        expected_yield_per_hectare,
        average_market_price_per_kg,
        water_requirements,
        soil_type,
        risk_level,
        suitable_for_smallholders,
        is_active,
      } = req.body;

      // Check if crop with same name exists
      const existingCrop = await Crop.findOne({
        where: { crop_name: { [Op.iLike]: crop_name } },
      });

      if (existingCrop) {
        return res.status(400).json({
          message: "Crop with the same name already exists",
        });
      }

      // Prepare crop data with proper type conversion
      const cropData = {
        crop_name: crop_name?.trim(),
        crop_category,
        planting_season,
        growing_duration_days: growing_duration_days ? parseInt(growing_duration_days) : null,
        expected_yield_per_hectare: expected_yield_per_hectare ? parseFloat(expected_yield_per_hectare) : null,
        average_market_price_per_kg: average_market_price_per_kg ? parseFloat(average_market_price_per_kg) : null,
        water_requirements: water_requirements || 'medium',
        soil_type: soil_type || 'any',
        risk_level: risk_level || 'medium',
        suitable_for_smallholders: suitable_for_smallholders !== undefined ? Boolean(suitable_for_smallholders) : true,
        is_active: is_active !== undefined ? Boolean(is_active) : true,
      };

      // Validate required fields
      if (!cropData.crop_name) {
        return res.status(400).json({
          message: "Crop name is required",
        });
      }

      if (!cropData.crop_category) {
        return res.status(400).json({
          message: "Crop category is required",
        });
      }

      if (!cropData.planting_season) {
        return res.status(400).json({
          message: "Planting season is required",
        });
      }

      if (!cropData.growing_duration_days) {
        return res.status(400).json({
          message: "Growing duration is required",
        });
      }

      const newCrop = await Crop.create(cropData);

      return res.status(201).json({
        message: "Crop created successfully",
        data: newCrop,
      });
    } catch (error) {
      console.error('Error creating crop:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value,
        }));
        
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
          details: validationErrors
        });
      }
      
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateCrop(req, res) {
    const cropId = req.params.id;
    try {
      const crop = await Crop.findByPk(cropId);

      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }

      // Handle data conversion for update
      const updateData = { ...req.body };
      
      // Convert numeric fields
      if (updateData.growing_duration_days !== undefined) {
        updateData.growing_duration_days = updateData.growing_duration_days ? parseInt(updateData.growing_duration_days) : null;
      }
      if (updateData.expected_yield_per_hectare !== undefined) {
        updateData.expected_yield_per_hectare = updateData.expected_yield_per_hectare ? parseFloat(updateData.expected_yield_per_hectare) : null;
      }
      if (updateData.average_market_price_per_kg !== undefined) {
        updateData.average_market_price_per_kg = updateData.average_market_price_per_kg ? parseFloat(updateData.average_market_price_per_kg) : null;
      }

      // Convert boolean fields
      if (updateData.suitable_for_smallholders !== undefined) {
        updateData.suitable_for_smallholders = Boolean(updateData.suitable_for_smallholders);
      }
      if (updateData.is_active !== undefined) {
        updateData.is_active = Boolean(updateData.is_active);
      }

      const updatedCrop = await crop.update(updateData);

      return res.status(200).json({
        message: "Crop updated successfully",
        data: updatedCrop,
      });
    } catch (error) {
      console.error('Error updating crop:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value,
        }));
        
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
          details: validationErrors
        });
      }
      
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteCrop(req, res) {
    const cropId = req.params.id;
    try {
      const crop = await Crop.findByPk(cropId);

      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }

      // TODO: Check if crop is being used by farmers
      // const farmerCount = await Farmer.count({ 
      //   where: { 
      //     primary_crops: { [Op.like]: `%"${crop.crop_name}"%` } 
      //   } 
      // });

      // if (farmerCount > 0) {
      //   return res.status(400).json({
      //     message: "Cannot delete crop that is being grown by farmers.",
      //   });
      // }

      await crop.destroy();

      return res.status(200).json({
        message: "Crop deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting crop:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  // Get crop statistics
  static async getCropStats(req, res) {
    try {
      const { crop_category, planting_season } = req.query;
      
      const whereClause = { is_active: true };
      if (crop_category) whereClause.crop_category = crop_category;
      if (planting_season) whereClause.planting_season = planting_season;

      const stats = await Promise.all([
        // Total active crops
        Crop.count({ where: whereClause }),
        
        // Crops by category
        Crop.count({ where: { ...whereClause, crop_category: 'cereals' } }),
        Crop.count({ where: { ...whereClause, crop_category: 'legumes' } }),
        Crop.count({ where: { ...whereClause, crop_category: 'vegetables' } }),
        Crop.count({ where: { ...whereClause, crop_category: 'fruits' } }),
        Crop.count({ where: { ...whereClause, crop_category: 'cash_crops' } }),
        Crop.count({ where: { ...whereClause, crop_category: 'tubers' } }),
        
        // Crops by planting season
        Crop.count({ where: { ...whereClause, planting_season: 'dry_season' } }),
        Crop.count({ where: { ...whereClause, planting_season: 'wet_season' } }),
        Crop.count({ where: { ...whereClause, planting_season: 'year_round' } }),
        
        // Crops suitable for smallholders
        Crop.count({ where: { ...whereClause, suitable_for_smallholders: true } }),
        
        // Average market price
        Crop.findOne({
          where: { ...whereClause, average_market_price_per_kg: { [Op.not]: null } },
          attributes: [
            [db.sequelize.fn('AVG', db.sequelize.col('average_market_price_per_kg')), 'avgPrice'],
            [db.sequelize.fn('MIN', db.sequelize.col('average_market_price_per_kg')), 'minPrice'],
            [db.sequelize.fn('MAX', db.sequelize.col('average_market_price_per_kg')), 'maxPrice']
          ],
          raw: true
        }),
        
        // Average yield
        Crop.findOne({
          where: { ...whereClause, expected_yield_per_hectare: { [Op.not]: null } },
          attributes: [
            [db.sequelize.fn('AVG', db.sequelize.col('expected_yield_per_hectare')), 'avgYield'],
            [db.sequelize.fn('MIN', db.sequelize.col('expected_yield_per_hectare')), 'minYield'],
            [db.sequelize.fn('MAX', db.sequelize.col('expected_yield_per_hectare')), 'maxYield']
          ],
          raw: true
        })
      ]);

      const priceStats = stats[11] || {};
      const yieldStats = stats[12] || {};

      res.status(200).json({
        message: "Crop statistics fetched successfully",
        data: {
          totalActiveCrops: stats[0],
          categoryBreakdown: {
            cereals: stats[1],
            legumes: stats[2],
            vegetables: stats[3],
            fruits: stats[4],
            cash_crops: stats[5],
            tubers: stats[6],
          },
          seasonBreakdown: {
            dry_season: stats[7],
            wet_season: stats[8],
            year_round: stats[9],
          },
          suitableForSmallholders: stats[10],
          priceStatistics: {
            averagePrice: parseFloat(priceStats.avgPrice) || 0,
            minPrice: parseFloat(priceStats.minPrice) || 0,
            maxPrice: parseFloat(priceStats.maxPrice) || 0,
          },
          yieldStatistics: {
            averageYield: parseFloat(yieldStats.avgYield) || 0,
            minYield: parseFloat(yieldStats.minYield) || 0,
            maxYield: parseFloat(yieldStats.maxYield) || 0,
          }
        },
      });
    } catch (error) {
      console.error('Error fetching crop statistics:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get crop recommendations for farmers
  static async getCropRecommendations(req, res) {
    try {
      const { 
        season, 
        soil_type, 
        water_availability = 'medium',
        smallholder = 'true',
        risk_tolerance = 'medium',
        limit = 10 
      } = req.query;

      const whereClause = { is_active: true };
      
      // Filter by season if provided
      if (season) {
        if (season === 'current') {
          // Determine current season based on month (simplified for Rwanda)
          const currentMonth = new Date().getMonth() + 1;
          if (currentMonth >= 6 && currentMonth <= 8) {
            whereClause.planting_season = { [Op.in]: ['dry_season', 'year_round'] };
          } else {
            whereClause.planting_season = { [Op.in]: ['wet_season', 'year_round'] };
          }
        } else {
          whereClause.planting_season = { [Op.in]: [season, 'year_round'] };
        }
      }

      // Filter by soil type
      if (soil_type && soil_type !== 'any') {
        whereClause.soil_type = { [Op.in]: [soil_type, 'any'] };
      }

      // Filter by water requirements
      const waterMapping = {
        'low': ['low'],
        'medium': ['low', 'medium'],
        'high': ['low', 'medium', 'high']
      };
      if (waterMapping[water_availability]) {
        whereClause.water_requirements = { [Op.in]: waterMapping[water_availability] };
      }

      // Filter by smallholder suitability
      if (smallholder === 'true') {
        whereClause.suitable_for_smallholders = true;
      }

      // Filter by risk tolerance
      const riskMapping = {
        'low': ['low'],
        'medium': ['low', 'medium'], 
        'high': ['low', 'medium', 'high']
      };
      if (riskMapping[risk_tolerance]) {
        whereClause.risk_level = { [Op.in]: riskMapping[risk_tolerance] };
      }

      let crops = await Crop.findAll({
        where: whereClause,
        limit: parseInt(limit),
        order: [
          [db.sequelize.literal('RANDOM()'), ''] // Random ordering for variety
        ],
      });

      // Add computed data and sort by profitability
      const cropsWithData = crops.map(crop => {
        const cropData = crop.toJSON();
        cropData.seasonDisplay = crop.getSeasonDisplay();
        cropData.categoryDisplay = crop.getCategoryDisplay();
        cropData.profitabilityScore = crop.getProfitabilityScore();
        cropData.growingPeriodMonths = crop.getGrowingPeriodMonths();
        cropData.waterDisplay = crop.getWaterDisplay();
        cropData.soilDisplay = crop.getSoilDisplay();
        
        // Add recommendation score based on user preferences
        let recommendationScore = cropData.profitabilityScore;
        
        // Boost score for exact matches
        if (season && crop.planting_season === season) recommendationScore += 10;
        if (soil_type && crop.soil_type === soil_type) recommendationScore += 5;
        if (water_availability && crop.water_requirements === water_availability) recommendationScore += 5;
        
        cropData.recommendationScore = Math.max(0, Math.min(100, recommendationScore));
        return cropData;
      });

      // Sort by recommendation score
      cropsWithData.sort((a, b) => b.recommendationScore - a.recommendationScore);

      res.status(200).json({
        message: "Crop recommendations fetched successfully",
        data: cropsWithData,
        criteria: {
          season,
          soil_type,
          water_availability,
          smallholder: smallholder === 'true',
          risk_tolerance,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get filter options for frontend dropdowns
  static async getCropFilters(req, res) {
    try {
      const categories = ['cereals', 'legumes', 'vegetables', 'fruits', 'cash_crops', 'tubers'];
      const seasons = ['dry_season', 'wet_season', 'year_round'];
      const waterRequirements = ['low', 'medium', 'high'];
      const soilTypes = ['any', 'clay', 'loam', 'sandy'];
      const riskLevels = ['low', 'medium', 'high'];

      res.status(200).json({
        message: "Crop filters fetched successfully",
        data: {
          categories,
          seasons,
          waterRequirements,
          soilTypes,
          riskLevels,
        }
      });
    } catch (error) {
      console.error('Error fetching crop filters:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get crops suitable for current season
  static async getCurrentSeasonCrops(req, res) {
    try {
      // Determine current season based on month (Rwanda calendar)
      const currentMonth = new Date().getMonth() + 1;
      let currentSeason;
      
      if (currentMonth >= 6 && currentMonth <= 8) {
        currentSeason = 'dry_season';
      } else {
        currentSeason = 'wet_season';
      }

      const crops = await Crop.findAll({
        where: {
          is_active: true,
          planting_season: { [Op.in]: [currentSeason, 'year_round'] }
        },
        order: [['crop_name', 'ASC']],
      });

      // Add computed fields
      const cropsWithComputedData = crops.map(crop => {
        const cropData = crop.toJSON();
        cropData.seasonDisplay = crop.getSeasonDisplay();
        cropData.categoryDisplay = crop.getCategoryDisplay();
        cropData.profitabilityScore = crop.getProfitabilityScore();
        cropData.growingPeriodMonths = crop.getGrowingPeriodMonths();
        cropData.waterDisplay = crop.getWaterDisplay();
        cropData.soilDisplay = crop.getSoilDisplay();
        return cropData;
      });

      res.status(200).json({
        message: "Current season crops fetched successfully",
        data: cropsWithComputedData,
        currentSeason: currentSeason,
        seasonDisplay: currentSeason === 'dry_season' ? 'Dry Season (June-August)' : 'Wet Season (September-May)'
      });
    } catch (error) {
      console.error('Error fetching current season crops:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = {
  CropController,
};