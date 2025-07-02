const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define('Student', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    school: {
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
    enrollment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attendance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ovc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transfers: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    health: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    class: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Student;
}; 