"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HealthFacility extends Model {
    static associate(models) {
      HealthFacility.belongsTo(models.Region, {
        foreignKey: "region_id",
        as: "region",
        onDelete: "SET NULL",
      });
      
      // Future associations
      // HealthFacility.hasMany(models.PatientRecord, {
      //   foreignKey: "facility_id",
      //   as: "patientRecords",
      // });
      // HealthFacility.hasMany(models.VaccinationRecord, {
      //   foreignKey: "facility_id",
      //   as: "vaccinationRecords",
      // });
      // HealthFacility.hasMany(models.DiseaseReport, {
      //   foreignKey: "facility_id",
      //   as: "diseaseReports",
      // });
    }

    // Instance method to get full address from region
    getFullAddress() {
      if (this.region) {
        return `${this.region.regionName}, ${this.region.description || ''}`.trim();
      }
      return 'Address not specified';
    }

    // Instance method to calculate occupancy rate
    getOccupancyRate() {
      if (!this.bed_capacity || this.bed_capacity === 0) return 0;
      return Math.round((this.current_occupancy / this.bed_capacity) * 100);
    }

    // Instance method to get occupancy status
    getOccupancyStatus() {
      const rate = this.getOccupancyRate();
      if (rate >= 95) return 'critical';
      if (rate >= 80) return 'high';
      if (rate >= 60) return 'medium';
      return 'low';
    }

    // Instance method to get capacity utilization level
    getCapacityUtilization() {
      if (!this.monthly_patient_capacity || this.monthly_patient_capacity === 0) return 0;
      return Math.round((this.average_monthly_patients / this.monthly_patient_capacity) * 100);
    }

    // Instance method to get services offered array
    getServicesOffered() {
      try {
        return this.services_offered ? JSON.parse(this.services_offered) : [];
      } catch (error) {
        return [];
      }
    }

    // Instance method to set services offered
    setServicesOffered(services) {
      this.services_offered = JSON.stringify(services);
    }

    // Instance method to get staff summary
    getStaffSummary() {
      return {
        total: this.total_staff || 0,
        doctors: this.doctors || 0,
        nurses: this.nurses || 0,
        medical_assistants: this.medical_assistants || 0,
        support_staff: this.support_staff || 0,
        staffRatio: this.bed_capacity > 0 ? 
          Math.round(((this.total_staff || 0) / this.bed_capacity) * 100) / 100 : 0
      };
    }

    // Instance method to get facility capabilities
    getFacilityCapabilities() {
      return {
        laboratory: this.has_laboratory,
        pharmacy: this.has_pharmacy,
        radiology: this.has_radiology,
        maternity: this.has_maternity,
        emergency: this.has_emergency,
        ambulance: this.has_ambulance,
        isolation_beds: this.isolation_beds || 0,
        icu_beds: this.icu_beds || 0
      };
    }

    // Instance method to check if facility is operational
    isOperational() {
      return this.is_active && 
             (this.operational_status === 'fully_operational' || 
              this.operational_status === 'partially_operational');
    }

    // Instance method to get overall facility rating
    getFacilityRating() {
      const equipmentScore = this.getStatusScore(this.equipment_status);
      const infrastructureScore = this.getStatusScore(this.infrastructure_status);
      const occupancyRate = this.getOccupancyRate();
      const staffRatio = this.getStaffSummary().staffRatio;
      
      // Calculate weighted score
      const overallScore = (
        (equipmentScore * 0.3) +
        (infrastructureScore * 0.3) +
        (occupancyRate <= 90 ? 100 : Math.max(0, 100 - (occupancyRate - 90) * 2)) * 0.2 +
        (Math.min(100, staffRatio * 20) * 0.2)
      );
      
      if (overallScore >= 90) return 'excellent';
      if (overallScore >= 75) return 'good';
      if (overallScore >= 60) return 'fair';
      if (overallScore >= 40) return 'poor';
      return 'critical';
    }

    // Helper method to convert status to score
    getStatusScore(status) {
      const scores = {
        'excellent': 100,
        'good': 80,
        'fair': 60,
        'poor': 40,
        'critical': 20
      };
      return scores[status] || 0;
    }

    // Instance method to check if license is valid
    isLicenseValid() {
      if (!this.license_expiry_date) return false;
      return new Date(this.license_expiry_date) > new Date();
    }

    // Instance method to get days until license expiry
    getDaysUntilLicenseExpiry() {
      if (!this.license_expiry_date) return null;
      const today = new Date();
      const expiryDate = new Date(this.license_expiry_date);
      const diffTime = expiryDate - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  HealthFacility.init(
    {
      facility_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      facility_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Facility name cannot be empty",
          },
          len: {
            args: [3, 200],
            msg: "Facility name must be between 3 and 200 characters",
          },
        },
      },
      facility_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          msg: "Facility code already exists",
        },
        validate: {
          notEmpty: {
            msg: "Facility code cannot be empty",
          },
          len: {
            args: [3, 20],
            msg: "Facility code must be between 3 and 20 characters",
          },
        },
      },
      facility_type: {
        type: DataTypes.ENUM("hospital", "health_center", "health_post", "clinic", "dispensary"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["hospital", "health_center", "health_post", "clinic", "dispensary"]],
            msg: "Facility type must be one of: hospital, health_center, health_post, clinic, dispensary",
          },
        },
      },
      ownership_type: {
        type: DataTypes.ENUM("public", "private", "faith_based", "ngo", "cooperative"),
        allowNull: false,
        defaultValue: "public",
        validate: {
          isIn: {
            args: [["public", "private", "faith_based", "ngo", "cooperative"]],
            msg: "Ownership type must be one of: public, private, faith_based, ngo, cooperative",
          },
        },
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
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      bed_capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Bed capacity must be an integer"
          },
          min: {
            args: [0],
            msg: "Bed capacity cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('bed_capacity', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('bed_capacity', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      current_occupancy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Current occupancy must be an integer"
          },
          min: {
            args: [0],
            msg: "Current occupancy cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('current_occupancy', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('current_occupancy', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      total_staff: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Total staff must be an integer"
          },
          min: {
            args: [0],
            msg: "Total staff cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('total_staff', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('total_staff', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      doctors: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Number of doctors must be an integer"
          },
          min: {
            args: [0],
            msg: "Number of doctors cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('doctors', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('doctors', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      nurses: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Number of nurses must be an integer"
          },
          min: {
            args: [0],
            msg: "Number of nurses cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('nurses', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('nurses', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      medical_assistants: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Number of medical assistants must be an integer"
          },
          min: {
            args: [0],
            msg: "Number of medical assistants cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('medical_assistants', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('medical_assistants', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      support_staff: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Number of support staff must be an integer"
          },
          min: {
            args: [0],
            msg: "Number of support staff cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('support_staff', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('support_staff', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      services_offered: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isValidJSON(value) {
            if (value) {
              try {
                JSON.parse(value);
              } catch (error) {
                throw new Error('Services offered must be a valid JSON array');
              }
            }
          },
        },
      },
      has_laboratory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_pharmacy: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_radiology: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_maternity: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_emergency: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_ambulance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      equipment_status: {
        type: DataTypes.ENUM("excellent", "good", "fair", "poor", "critical"),
        allowNull: false,
        defaultValue: "good",
        validate: {
          isIn: {
            args: [["excellent", "good", "fair", "poor", "critical"]],
            msg: "Equipment status must be one of: excellent, good, fair, poor, critical",
          },
        },
      },
      infrastructure_status: {
        type: DataTypes.ENUM("excellent", "good", "fair", "poor", "critical"),
        allowNull: false,
        defaultValue: "good",
        validate: {
          isIn: {
            args: [["excellent", "good", "fair", "poor", "critical"]],
            msg: "Infrastructure status must be one of: excellent, good, fair, poor, critical",
          },
        },
      },
      power_source: {
        type: DataTypes.ENUM("grid", "generator", "solar", "hybrid", "none"),
        allowNull: false,
        defaultValue: "grid",
        validate: {
          isIn: {
            args: [["grid", "generator", "solar", "hybrid", "none"]],
            msg: "Power source must be one of: grid, generator, solar, hybrid, none",
          },
        },
      },
      water_source: {
        type: DataTypes.ENUM("piped", "borehole", "well", "rainwater", "none"),
        allowNull: false,
        defaultValue: "piped",
        validate: {
          isIn: {
            args: [["piped", "borehole", "well", "rainwater", "none"]],
            msg: "Water source must be one of: piped, borehole, well, rainwater, none",
          },
        },
      },
      operational_status: {
        type: DataTypes.ENUM("fully_operational", "partially_operational", "under_maintenance", "closed"),
        allowNull: false,
        defaultValue: "fully_operational",
        validate: {
          isIn: {
            args: [["fully_operational", "partially_operational", "under_maintenance", "closed"]],
            msg: "Operational status must be one of: fully_operational, partially_operational, under_maintenance, closed",
          },
        },
      },
      operating_hours: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "24/7",
      },
      monthly_patient_capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Monthly patient capacity must be an integer"
          },
          min: {
            args: [0],
            msg: "Monthly patient capacity cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('monthly_patient_capacity', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('monthly_patient_capacity', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      average_monthly_patients: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Average monthly patients must be an integer"
          },
          min: {
            args: [0],
            msg: "Average monthly patients cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('average_monthly_patients', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('average_monthly_patients', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      last_inspection_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: "Last inspection date must be a valid date",
          },
        },
      },
      accreditation_status: {
        type: DataTypes.ENUM("accredited", "provisional", "pending", "not_accredited"),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: {
            args: [["accredited", "provisional", "pending", "not_accredited"]],
            msg: "Accreditation status must be one of: accredited, provisional, pending, not_accredited",
          },
        },
      },
      license_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      license_expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: "License expiry date must be a valid date",
          },
        },
      },
      director_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      director_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      director_email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
          isEmail: {
            msg: "Please provide a valid director email address",
          },
        },
      },
      emergency_preparedness_level: {
        type: DataTypes.ENUM("high", "medium", "low", "none"),
        allowNull: false,
        defaultValue: "medium",
        validate: {
          isIn: {
            args: [["high", "medium", "low", "none"]],
            msg: "Emergency preparedness level must be one of: high, medium, low, none",
          },
        },
      },
      isolation_beds: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Number of isolation beds must be an integer"
          },
          min: {
            args: [0],
            msg: "Number of isolation beds cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('isolation_beds', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('isolation_beds', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      icu_beds: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Number of ICU beds must be an integer"
          },
          min: {
            args: [0],
            msg: "Number of ICU beds cannot be negative",
          },
        },
        set(value) {
          if (value === null || value === undefined || value === '') {
            this.setDataValue('icu_beds', 0);
          } else {
            const parsed = parseInt(value, 10);
            this.setDataValue('icu_beds', isNaN(parsed) ? 0 : Math.max(0, parsed));
          }
        }
      },
      established_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: "Established date must be a valid date",
          },
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "HealthFacility",
      tableName: "HealthFacilities",
      timestamps: true,
      underscored: true,
      hooks: {
        beforeSave: (facility, options) => {
          // Auto-calculate total staff if not provided
          if (facility.doctors !== undefined || facility.nurses !== undefined || 
              facility.medical_assistants !== undefined || facility.support_staff !== undefined) {
            facility.total_staff = (facility.doctors || 0) + 
                                 (facility.nurses || 0) + 
                                 (facility.medical_assistants || 0) + 
                                 (facility.support_staff || 0);
          }
          
          // Ensure current occupancy doesn't exceed bed capacity
          if (facility.current_occupancy && facility.bed_capacity && 
              facility.current_occupancy > facility.bed_capacity) {
            facility.current_occupancy = facility.bed_capacity;
          }
        }
      }
    }
  );

  return HealthFacility;
};