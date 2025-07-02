const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MarketPrices extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  MarketPrices.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    crop: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MarketPrices',
    tableName: 'market_prices',
  });
  return MarketPrices;
}; 