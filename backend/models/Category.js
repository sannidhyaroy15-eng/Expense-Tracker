const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING(200),
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: '📁',
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#3B82F6',
    },
    type: {
      type: DataTypes.ENUM('income', 'expense', 'both'),
      defaultValue: 'both',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'name'],
      },
    ],
  }
);

module.exports = Category;
