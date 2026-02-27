require('dotenv').config();
const { connectDB, sequelize } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

const seedTransactions = async () => {
  try {
    await connectDB();

    // Get or create a test user
    let user = await User.findOne({ where: { email: 'demo@example.com' } });
    
    if (!user) {
      user = await User.create({
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'demo123456', // Will be hashed by model
        monthlyBudget: 5000,
        currency: 'USD',
      });
      console.log('✅ Demo user created');
    }

    // Get categories
    const categories = await Category.findAll();
    
    if (categories.length === 0) {
      console.error('❌ No categories found. Run seedCategories.js first!');
      process.exit(1);
    }

    // Clear existing transactions for demo user
    await Transaction.destroy({ where: { userId: user.id } });

    // Sample transaction data for the last 3 months with realistic dates
    const now = new Date();
    const sampleTransactions = [];

    // Helper to create date instances
    const createDate = (daysAgo, hour = 10, minute = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      d.setHours(hour, minute, 0, 0);
      return d;
    };

    // Find categories by name
    const getCategoryByName = (name) => categories.find(c => c.name === name);

    // Sample transactions
    const transactions = [
      // Recent expenses (last week)
      {
        type: 'expense',
        category: 'Food & Dining',
        amount: 45.50,
        description: 'Lunch at downtown cafe',
        date: createDate(1, 12, 30),
        paymentMethod: 'card',
      },
      {
        type: 'expense',
        category: 'Transportation',
        amount: 15.00,
        description: 'Uber to office',
        date: createDate(2, 8, 15),
        paymentMethod: 'card',
      },
      {
        type: 'expense',
        category: 'Shopping',
        amount: 120.99,
        description: 'Clothing from mall',
        date: createDate(3, 14, 0),
        paymentMethod: 'card',
      },
      {
        type: 'income',
        category: 'Salary',
        amount: 4500.00,
        description: 'Monthly salary',
        date: createDate(5, 9, 0),
        paymentMethod: 'bank_transfer',
      },
      {
        type: 'expense',
        category: 'Entertainment',
        amount: 30.00,
        description: 'Movie tickets',
        date: createDate(4, 19, 30),
        paymentMethod: 'card',
      },

      // Mid-range transactions (2-4 weeks ago)
      {
        type: 'expense',
        category: 'Bills & Utilities',
        amount: 150.00,
        description: 'Internet bill',
        date: createDate(10, 10, 0),
        paymentMethod: 'bank_transfer',
      },
      {
        type: 'expense',
        category: 'Subscriptions',
        amount: 14.99,
        description: 'Netflix subscription',
        date: createDate(12, 11, 0),
        paymentMethod: 'card',
      },
      {
        type: 'expense',
        category: 'Groceries',
        amount: 85.50,
        description: 'Grocery shopping',
        date: createDate(8, 15, 0),
        paymentMethod: 'card',
      },
      {
        type: 'expense',
        category: 'Healthcare',
        amount: 60.00,
        description: 'Doctor visit',
        date: createDate(14, 9, 0),
        paymentMethod: 'cash',
      },

      // Older transactions (1+ month ago)
      {
        type: 'expense',
        category: 'Travel',
        amount: 250.00,
        description: 'Flight ticket',
        date: createDate(25, 10, 0),
        paymentMethod: 'card',
      },
      {
        type: 'expense',
        category: 'Rent',
        amount: 1200.00,
        description: 'Monthly rent',
        date: createDate(28, 10, 0),
        paymentMethod: 'bank_transfer',
      },
      {
        type: 'income',
        category: 'Freelance',
        amount: 500.00,
        description: 'Freelance project',
        date: createDate(22, 14, 0),
        paymentMethod: 'bank_transfer',
      },
      {
        type: 'expense',
        category: 'Education',
        amount: 150.00,
        description: 'Online course',
        date: createDate(20, 11, 0),
        paymentMethod: 'card',
      },
      {
        type: 'expense',
        category: 'Personal Care',
        amount: 40.00,
        description: 'Haircut',
        date: createDate(18, 16, 0),
        paymentMethod: 'cash',
      },
      {
        type: 'expense',
        category: 'Gifts',
        amount: 75.00,
        description: 'Birthday gift',
        date: createDate(16, 12, 0),
        paymentMethod: 'card',
      },
      {
        type: 'income',
        category: 'Bonus',
        amount: 1000.00,
        description: 'Performance bonus',
        date: createDate(30, 10, 0),
        paymentMethod: 'bank_transfer',
      },
      {
        type: 'expense',
        category: 'Food & Dining',
        amount: 65.00,
        description: 'Dinner with friends',
        date: createDate(24, 19, 30),
        paymentMethod: 'card',
      },
      {
        type: 'expense',
        category: 'Entertainment',
        amount: 20.00,
        description: 'Concert ticket',
        date: createDate(32, 18, 0),
        paymentMethod: 'card',
      },
      {
        type: 'expense',
        category: 'Transportation',
        amount: 50.00,
        description: 'Gas',
        date: createDate(26, 16, 0),
        paymentMethod: 'card',
      },
      {
        type: 'expense',
        category: 'Shopping',
        amount: 95.50,
        description: 'Electronics',
        date: createDate(35, 14, 0),
        paymentMethod: 'card',
      },
    ];

    // Add "Other" category with placeholder if not found for unknowns
    for (const txn of transactions) {
      const category = getCategoryByName(txn.category);
      if (!category) {
        console.warn(`⚠️  Category "${txn.category}" not found, skipping transaction`);
        continue;
      }

      sampleTransactions.push({
        userId: user.id,
        type: txn.type,
        categoryId: category.id,
        amount: txn.amount,
        description: txn.description,
        date: txn.date,
        paymentMethod: txn.paymentMethod,
        tags: [],
        notes: `Sample transaction for ${txn.type}`,
      });
    }

    await Transaction.bulkCreate(sampleTransactions);

    console.log(`✅ ${sampleTransactions.length} sample transactions seeded successfully`);
    console.log(`📊 Data loaded for user: ${user.email}`);
    console.log(`💡 Login with email: demo@example.com, password: demo123456`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding transactions:', error.message);
    process.exit(1);
  }
};

seedTransactions();
