const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dropout = sequelize.define('Dropout', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    school: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    earlyWarning: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pregnancy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reintegration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    absenteeism: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Dropout;
}; 