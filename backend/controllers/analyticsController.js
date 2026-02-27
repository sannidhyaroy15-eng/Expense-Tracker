const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Budget = require('../models/Budget');

// @route   GET /api/analytics/summary
// @desc    Get dashboard summary
// @access  Private
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const { month } = req.query;
    const now = new Date();
    const currentMonth = month ? new Date(month) : now;
    const monthStart = new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth(), 1));
    const monthEnd = new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 0));

    // Last 30 days
    const last30Days = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30));

    const [totalIncomeMonth, totalExpenseMonth, last30DaysExpense, last30DaysIncome] = await Promise.all([
      Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          type: 'income',
          date: { [Op.gte]: monthStart, [Op.lte]: monthEnd },
        },
      }),
      Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          type: 'expense',
          date: { [Op.gte]: monthStart, [Op.lte]: monthEnd },
        },
      }),
      Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          type: 'expense',
          date: { [Op.gte]: last30Days },
        },
      }),
      Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          type: 'income',
          date: { [Op.gte]: last30Days },
        },
      }),
    ]);

    const income = totalIncomeMonth || 0;
    const expense = totalExpenseMonth || 0;
    const balance = income - expense;

    res.status(200).json({
      success: true,
      data: {
        currentMonth: {
          income,
          expense,
          balance,
        },
        last30Days: {
          income: last30DaysIncome || 0,
          expense: last30DaysExpense || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/analytics/expense-by-category
// @desc    Get expense distribution by category
// @access  Private
exports.getExpenseByCategory = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let dateWhere = {};
    if (startDate || endDate) {
      if (startDate) dateWhere[Op.gte] = new Date(startDate);
      if (endDate) dateWhere[Op.lte] = new Date(endDate);
    }

    const data = await Transaction.findAll({
      attributes: [
        'categoryId',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('Transaction.id')), 'count'],
      ],
      where: {
        userId: req.user.id,
        type: 'expense',
        ...(Object.keys(dateWhere).length > 0 && { date: dateWhere }),
      },
      include: [
        {
          model: Category,
          attributes: ['name', 'icon', 'color'],
          as: 'category',
        },
      ],
      group: ['categoryId'],
      raw: false,
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
      subQuery: false,
    });

    const formattedData = data.map((item) => ({
      _id: item.categoryId,
      category: item.category?.name || 'Unknown',
      icon: item.category?.icon || '📁',
      color: item.category?.color || '#3B82F6',
      amount: parseFloat(item.dataValues.total),
      count: item.dataValues.count,
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/analytics/monthly-comparison
// @desc    Get monthly income vs expense
// @access  Private
exports.getMonthlyComparison = async (req, res, next) => {
  try {
    const { months = 12 } = req.query;
    const startDate = new Date(Date.UTC(
      new Date().getUTCFullYear(), 
      new Date().getUTCMonth() - months + 1, 
      1
    ));

    const data = await Transaction.findAll({
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('date')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
        'type',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
      ],
      where: {
        userId: req.user.id,
        date: { [Op.gte]: startDate },
      },
      group: [sequelize.fn('YEAR', sequelize.col('date')), sequelize.fn('MONTH', sequelize.col('date')), 'type'],
      raw: true,
      order: [
        [sequelize.fn('YEAR', sequelize.col('date')), 'ASC'],
        [sequelize.fn('MONTH', sequelize.col('date')), 'ASC'],
      ],
      subQuery: false,
    });

    const formattedData = {};
    data.forEach((item) => {
      const key = `${item.year}-${String(item.month).padStart(2, '0')}`;
      if (!formattedData[key]) {
        formattedData[key] = { income: 0, expense: 0 };
      }
      formattedData[key][item.type] = parseFloat(item.total);
    });

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/analytics/spending-trend
// @desc    Get spending trend over time
// @access  Private
exports.getSpendingTrend = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const now = new Date();
    const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - days));

    const data = await Transaction.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('date')), 'date'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
      ],
      where: {
        userId: req.user.id,
        type: 'expense',
        date: { [Op.gte]: startDate },
      },
      group: [sequelize.fn('DATE', sequelize.col('date'))],
      raw: true,
      order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']],
      subQuery: false,
    });

    const formattedData = data.map((item) => ({
      _id: item.date,
      total: parseFloat(item.total),
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};
