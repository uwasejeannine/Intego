const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Seeds extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  Seeds.init({
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
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Seeds',
    tableName: 'seeds',
  });
  return Seeds;
}; 