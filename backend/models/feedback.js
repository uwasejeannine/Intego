const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      // User associations
      Feedback.belongsTo(models.User, {
        foreignKey: "fromUserId",
        as: "fromUser",
        onDelete: "CASCADE"
      });
      
      Feedback.belongsTo(models.User, {
        foreignKey: "toUserId",
        as: "toUser",
        onDelete: "CASCADE"
      });

      // Self-referential association for replies
      Feedback.belongsTo(Feedback, {
        foreignKey: "parentId",
        as: "parent",
        onDelete: "CASCADE"
      });
      
      Feedback.hasMany(Feedback, {
        foreignKey: "parentId",
        as: "replies",
        onDelete: "CASCADE"
      });
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
        validate: {
          notEmpty: true
        }
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      toUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Feedbacks',
          key: 'id'
        }
      },
    },
    {
      sequelize,
      modelName: "Feedback",
      tableName: "Feedbacks",
      timestamps: true,
      indexes: [
        {
          fields: ['fromUserId']
        },
        {
          fields: ['toUserId']
        },
        {
          fields: ['parentId']
        },
        {
          fields: ['section', 'itemId']
        }
      ]
    }
  );

  return Feedback;
}; 