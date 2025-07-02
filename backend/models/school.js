const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const School = sequelize.define('School', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attendance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentsPerClass: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    faculties: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dropoutRate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    headTeacher: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    performance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return School;
}; 