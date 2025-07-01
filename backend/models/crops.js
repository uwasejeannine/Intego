"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Crop extends Model {
    static associate(models) {
      // Define associations here if needed
      // Future: Crop.belongsToMany(models.Farmer, { through: 'FarmerCrops' });
    }

    // Instance method to get season display text
    getSeasonDisplay() {
      const seasonMap = {
        'dry_season': 'Dry Season (June-August)',
        'wet_season': 'Wet Season (September-May)', 
        'year_round': 'Year Round'
      };
      return seasonMap[this.planting_season] || this.planting_season;
    }

    // Instance method to get category display text
    getCategoryDisplay() {
      const categoryMap = {
        'cereals': 'Cereals',
        'legumes': 'Legumes', 
        'vegetables': 'Vegetables',
        'fruits': 'Fruits',
        'cash_crops': 'Cash Crops',
        'tubers': 'Tubers'
      };
      return categoryMap[this.crop_category] || this.crop_category;
    }

    // Instance method to calculate profitability score
    getProfitabilityScore() {
      let score = 0;
      
      // Price factor (out of 40 points)
      if (this.average_market_price_per_kg) {
        if (this.average_market_price_per_kg >= 1000) score += 40;
        else if (this.average_market_price_per_kg >= 500) score += 30;
        else if (this.average_market_price_per_kg >= 200) score += 20;
        else score += 10;
      }
      
      // Yield factor (out of 30 points)
      if (this.expected_yield_per_hectare) {
        if (this.expected_yield_per_hectare >= 5000) score += 30;
        else if (this.expected_yield_per_hectare >= 2000) score += 20;
        else if (this.expected_yield_per_hectare >= 1000) score += 15;
        else score += 10;
      }
      
      // Risk penalty (out of 20 points)
      if (this.risk_level === 'low') score += 20;
      else if (this.risk_level === 'medium') score += 10;
      else score += 0; // high risk
      
      // Smallholder suitability (out of 10 points)
      if (this.suitable_for_smallholders) score += 10;
      
      return Math.min(100, Math.max(0, score));
    }

    // Instance method to get growing period in months
    getGrowingPeriodMonths() {
      return Math.round(this.growing_duration_days / 30);
    }

    // Instance method to get water requirement display
    getWaterDisplay() {
      const waterMap = {
        'low': 'Low Water Needs',
        'medium': 'Moderate Water Needs',
        'high': 'High Water Needs'
      };
      return waterMap[this.water_requirements] || this.water_requirements;
    }

    // Instance method to get soil requirement display
    getSoilDisplay() {
      const soilMap = {
        'any': 'Any Soil Type',
        'clay': 'Clay Soil',
        'loam': 'Loam Soil', 
        'sandy': 'Sandy Soil'
      };
      return soilMap[this.soil_type] || this.soil_type;
    }
  }

  Crop.init(
    {
      crop_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      crop_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          msg: "Crop name already exists",
        },
        validate: {
          notEmpty: {
            msg: "Crop name cannot be empty",
          },
          len: {
            args: [2, 100],
            msg: "Crop name must be between 2 and 100 characters",
          },
        },
      },
      crop_category: {
        type: DataTypes.ENUM('cereals', 'legumes', 'vegetables', 'fruits', 'cash_crops', 'tubers'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['cereals', 'legumes', 'vegetables', 'fruits', 'cash_crops', 'tubers']],
            msg: "Crop category must be one of: cereals, legumes, vegetables, fruits, cash_crops, tubers",
          },
        },
      },
      planting_season: {
        type: DataTypes.ENUM('dry_season', 'wet_season', 'year_round'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['dry_season', 'wet_season', 'year_round']],
            msg: "Planting season must be one of: dry_season, wet_season, year_round",
          },
        },
      },
      growing_duration_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Growing duration must be an integer"
          },
          min: {
            args: [30],
            msg: "Growing duration must be at least 30 days",
          },
          max: {
            args: [1095], // 3 years max
            msg: "Growing duration cannot exceed 3 years",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            throw new Error('Growing duration is required');
          } else {
            const parsed = parseInt(value, 10);
            if (isNaN(parsed)) {
              throw new Error('Growing duration must be a valid number');
            }
            this.setDataValue('growing_duration_days', Math.max(30, parsed));
          }
        }
      },
      expected_yield_per_hectare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isNumeric: {
            msg: "Expected yield must be a valid number"
          },
          min: {
            args: [0],
            msg: "Expected yield cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('expected_yield_per_hectare', null);
          } else {
            const parsed = parseFloat(value);
            this.setDataValue('expected_yield_per_hectare', isNaN(parsed) ? null : Math.max(0, parsed));
          }
        }
      },
      average_market_price_per_kg: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isNumeric: {
            msg: "Average market price must be a valid number"
          },
          min: {
            args: [0],
            msg: "Average market price cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('average_market_price_per_kg', null);
          } else {
            const parsed = parseFloat(value);
            this.setDataValue('average_market_price_per_kg', isNaN(parsed) ? null : Math.max(0, parsed));
          }
        }
      },
      water_requirements: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium',
        validate: {
          isIn: {
            args: [['low', 'medium', 'high']],
            msg: "Water requirements must be one of: low, medium, high",
          },
        },
      },
      soil_type: {
        type: DataTypes.ENUM('any', 'clay', 'loam', 'sandy'),
        allowNull: false,
        defaultValue: 'any',
        validate: {
          isIn: {
            args: [['any', 'clay', 'loam', 'sandy']],
            msg: "Soil type must be one of: any, clay, loam, sandy",
          },
        },
      },
      risk_level: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium',
        validate: {
          isIn: {
            args: [['low', 'medium', 'high']],
            msg: "Risk level must be one of: low, medium, high",
          },
        },
      },
      suitable_for_smallholders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Crop",
      tableName: "Crops",
      timestamps: true,
      underscored: true,
    }
  );

  return Crop;
};