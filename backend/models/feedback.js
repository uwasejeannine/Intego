const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.User, { foreignKey: "fromUserId", as: "fromUser" });
      Feedback.belongsTo(models.User, { foreignKey: "toUserId", as: "toUser" });
      Feedback.belongsTo(Feedback, { foreignKey: "parentId", as: "parent" });
      Feedback.hasMany(Feedback, { foreignKey: "parentId", as: "replies" });
    }
  }
  Feedback.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      section: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      toUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Feedback",
      tableName: "Feedbacks",
      timestamps: true,
    }
  );
  return Feedback;
}; 