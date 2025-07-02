const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Teacher = sequelize.define('Teacher', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    school: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recruitment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    training: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cpd: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    retirement: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ratio: {
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
  return Teacher;
}; 