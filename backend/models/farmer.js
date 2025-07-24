"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Farmer extends Model {
    static associate(models) {
      Farmer.belongsTo(models.Region, {
        foreignKey: "region_id",
        as: "region",
        onDelete: "SET NULL",
      });
      Farmer.belongsTo(models.Cooperative, {
        foreignKey: "cooperative_id",
        as: "cooperative",
        onDelete: "SET NULL",
      });
    }

    // Instance method to get full name
    getFullName() {
      return `${this.first_name} ${this.last_name}`;
    }

    // Instance method to get experience level
    getExperienceLevel() {
      if (!this.years_experience) return "Unknown";
      if (this.years_experience < 3) return "Beginner";
      if (this.years_experience < 10) return "Intermediate";
      return "Expert";
    }

    // Instance method to get parsed primary crops
    getPrimaryCrops() {
      try {
        return this.primary_crops ? JSON.parse(this.primary_crops) : [];
      } catch (error) {
        return [];
      }
    }

    // Instance method to set primary crops
    setPrimaryCrops(crops) {
      this.primary_crops = JSON.stringify(crops);
    }
  }

  Farmer.init(
    {
      farmer_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "First name cannot be empty",
          },
          len: {
            args: [2, 100],
            msg: "First name must be between 2 and 100 characters",
          },
        },
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Last name cannot be empty",
          },
          len: {
            args: [2, 100],
            msg: "Last name must be between 2 and 100 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: {
          msg: "Email address already exists",
        },
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      region_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: "Region ID must be an integer"
          }
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('region_id', null);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('region_id', isNaN(parsed) ? null : parsed);
          }
        }
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      farm_location: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      total_farm_area_hectares: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isNumeric: {
            msg: "Farm area must be a valid number"
          },
          min: {
            args: [0],
            msg: "Farm area cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('total_farm_area_hectares', null);
          } else {
            const parsed = parseFloat(value);
            if (isNaN(parsed)) {
              this.setDataValue('total_farm_area_hectares', null);
            } else {
              this.setDataValue('total_farm_area_hectares', Math.max(0, parsed));
            }
          }
        }
      },
      years_experience: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: "Years of experience must be an integer"
          },
          min: {
            args: [0],
            msg: "Years of experience cannot be negative",
          },
          max: {
            args: [100],
            msg: "Years of experience cannot exceed 100 years",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('years_experience', null);
          } else {
            const parsed = parseInt(value, 10);
            if (isNaN(parsed)) {
              this.setDataValue('years_experience', null);
            } else {
              this.setDataValue('years_experience', Math.max(0, Math.min(100, parsed)));
            }
          }
        }
      },
      farmer_type: {
        type: DataTypes.ENUM("smallholder", "commercial", "cooperative", "estate"),
        allowNull: false,
        defaultValue: "smallholder",
        validate: {
          isIn: {
            args: [["smallholder", "commercial", "cooperative", "estate"]],
            msg: "Farmer type must be one of: smallholder, commercial, cooperative, estate",
          },
        },
      },
      primary_crops: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isValidJSON(value) {
            if (value) {
              try {
                JSON.parse(value);
              } catch (error) {
                throw new Error('Primary crops must be a valid JSON array');
              }
            }
          },
        },
      },
      cooperative_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: "Cooperative ID must be an integer"
          }
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('cooperative_id', null);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('cooperative_id', isNaN(parsed) ? null : parsed);
          }
        }
      },
      registration_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: {
            msg: "Registration date must be a valid date",
          },
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Farmer",
      tableName: "farmers",
      timestamps: true,
      underscored: true,
    }
  );

  return Farmer;
};