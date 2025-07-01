// models/report.js

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {}

  Report.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalBudgetSpending: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalProjectBudget: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      projectDuration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      projectObjectives: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      keyOutputs: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      keyChallengesFaced: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      proposedSolutions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      categoryOfProject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Physical achievements Vs Annual targets (Summary)
      keyIndicators: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      annTargets: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Annual Targets cannot be empty",
          },
          isValidTargets(value) {
            if (typeof value !== "object") {
              throw new Error("Annual Targets must be an object");
            }
            for (const key in value) {
              if (!Array.isArray(value[key]) || value[key].length !== 2) {
                throw new Error(
                  `Each key in Annual Targets must have an array of exactly two values`,
                );
              }
            }
          },
        },
      },
      term: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cumulativeAchievements: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nonCumulativeAchievements: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending",
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "projectId",
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "Report",
      tableName: "Reports",
      timestamps: false,
    },
  );

  return Report;
};
