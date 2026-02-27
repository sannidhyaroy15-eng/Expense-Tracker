const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define(
  'Transaction',
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
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'bank_transfer', 'other'),
      defaultValue: 'cash',
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    notes: DataTypes.TEXT,
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'date'],
      },
      {
        fields: ['userId', 'categoryId'],
      },
      {
        fields: ['userId', 'type'],
      },
      {
        fields: ['userId', 'date', 'type'],
      },
    ],
  }
);

module.exports = Transaction;
