const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Performance = sequelize.define('Performance', {
    school: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exam: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passRate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationalAvg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    literacy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numeracy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trend: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lowPerforming: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Performance;
}; 