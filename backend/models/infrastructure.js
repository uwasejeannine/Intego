const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Infrastructure = sequelize.define('Infrastructure', {
    school: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    desks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    labs: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    libraries: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    latrines: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    electricity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    water: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meals: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ict: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    textbooks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    materials: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Infrastructure;
}; 