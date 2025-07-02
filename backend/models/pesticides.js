const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pesticides extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  Pesticides.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    distributed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    shortage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Pesticides',
    tableName: 'pesticides',
  });
  return Pesticides;
}; 