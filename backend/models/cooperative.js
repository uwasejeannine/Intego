"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cooperative extends Model {
    static associate(models) {
      Cooperative.hasMany(models.Farmer, {
        foreignKey: "cooperative_id",
        as: "farmers",
        onDelete: "SET NULL",
      });
      Cooperative.belongsTo(models.Region, {
        foreignKey: "regionId",
        as: "region",
        onDelete: "SET NULL",
      });
    }

    // Instance method to get parsed main crops
    getMainCrops() {
      try {
        return this.mainCrops ? JSON.parse(this.mainCrops) : [];
      } catch (error) {
        return [];
      }
    }

    // Instance method to set main crops
    setMainCrops(crops) {
      this.mainCrops = JSON.stringify(crops);
    }
  }

  Cooperative.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cooperativeName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Cooperative name cannot be empty",
          },
          len: {
            args: [3, 200],
            msg: "Cooperative name must be between 3 and 200 characters",
          },
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Location cannot be empty",
          },
        },
      },
      numberOfFarmers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Number of farmers must be an integer"
          },
          min: {
            args: [0],
            msg: "Number of farmers cannot be negative",
          },
        },
        // Add a setter to ensure proper conversion
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('numberOfFarmers', 0);
          } else {
            const parsed = parseInt(value, 10);
            if (isNaN(parsed)) {
              this.setDataValue('numberOfFarmers', 0);
            } else {
              this.setDataValue('numberOfFarmers', Math.max(0, parsed));
            }
          }
        }
      },
      totalLandSize: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isNumeric: {
            msg: "Total land size must be a valid number"
          },
          min: {
            args: [0],
            msg: "Total land size cannot be negative",
          },
        },
        // Add a setter to ensure proper conversion
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('totalLandSize', null);
          } else {
            const parsed = parseFloat(value);
            if (isNaN(parsed)) {
              this.setDataValue('totalLandSize', null);
            } else {
              this.setDataValue('totalLandSize', Math.max(0, parsed));
            }
          }
        }
      },
      contactPersonPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Contact person phone cannot be empty",
          },
        },
      },
      contactPersonEmail: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      mainCrops: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isValidJSON(value) {
            if (value) {
              try {
                JSON.parse(value);
              } catch (error) {
                throw new Error('Main crops must be a valid JSON array');
              }
            }
          },
        },
      },
      regionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: {
            msg: "Region ID must be an integer"
          }
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('regionId', null);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('regionId', isNaN(parsed) ? null : parsed);
          }
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Cooperative",
      tableName: "Cooperatives",
      timestamps: true,
    }
  );

  return Cooperative;
};