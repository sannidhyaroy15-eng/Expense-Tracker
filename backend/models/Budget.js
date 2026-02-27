const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Budget = sequelize.define(
  'Budget',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    month: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    spent: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    isMonthly: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    alertThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 80,
    },
    notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'month', 'categoryId'],
      },
    ],
  }
);

module.exports = Budget;
