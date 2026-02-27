require('dotenv').config();
const { connectDB, sequelize } = require('../config/db');
const Category = require('../models/Category');

const seedCategories = async () => {
  try {
    await connectDB();

    const defaultCategories = [
      // Expense categories
      { name: 'Food & Dining', icon: '🍔', color: '#F59E0B', type: 'expense', isDefault: true },
      { name: 'Transportation', icon: '🚗', color: '#3B82F6', type: 'expense', isDefault: true },
      { name: 'Shopping', icon: '🛍️', color: '#EC4899', type: 'expense', isDefault: true },
      { name: 'Entertainment', icon: '🎬', color: '#8B5CF6', type: 'expense', isDefault: true },
      { name: 'Bills & Utilities', icon: '📄', color: '#6366F1', type: 'expense', isDefault: true },
      { name: 'Rent', icon: '🏠', color: '#10B981', type: 'expense', isDefault: true },
      { name: 'Healthcare', icon: '⚕️', color: '#EF4444', type: 'expense', isDefault: true },
      { name: 'Education', icon: '📚', color: '#06B6D4', type: 'expense', isDefault: true },
      { name: 'Travel', icon: '✈️', color: '#F97316', type: 'expense', isDefault: true },
      { name: 'Subscriptions', icon: '📺', color: '#14B8A6', type: 'expense', isDefault: true },
      { name: 'Personal Care', icon: '💅', color: '#F43F5E', type: 'expense', isDefault: true },
      { name: 'Gifts', icon: '🎁', color: '#D946EF', type: 'expense', isDefault: true },

      // Income categories
      { name: 'Salary', icon: '💰', color: '#10B981', type: 'income', isDefault: true },
      { name: 'Freelance', icon: '💻', color: '#3B82F6', type: 'income', isDefault: true },
      { name: 'Investment', icon: '📈', color: '#F59E0B', type: 'income', isDefault: true },
      { name: 'Bonus', icon: '🎉', color: '#8B5CF6', type: 'income', isDefault: true },
      { name: 'Other Income', icon: '💵', color: '#6366F1', type: 'income', isDefault: true },
    ];

    await Promise.all(
      defaultCategories.map((cat) =>
        Category.findOrCreate({
          where: { name: cat.name, isDefault: true },
          defaults: cat,
        })
      )
    );

    console.log('✅ Default categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
