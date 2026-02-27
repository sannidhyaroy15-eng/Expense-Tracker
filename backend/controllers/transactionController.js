const { Op } = require('sequelize');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Budget = require('../models/Budget');

// @route   POST /api/transactions
// @desc    Create a transaction
// @access  Private
exports.createTransaction = async (req, res, next) => {
  try {
    const { type, category, amount, description, date, paymentMethod, tags, notes } = req.body;

    if (!type || !category || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate category exists and belongs to user or is default
    const categoryDoc = await Category.findOne({
      where: {
        id: category,
        [require('sequelize').Op.or]: [
          { isDefault: true },
          { userId: req.user.id },
        ],
      },
    });

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or you do not have permission to use this category',
      });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      categoryId: category,
      amount,
      description,
      date: date || new Date(),
      paymentMethod,
      tags: tags || [],
      notes,
    });

    await transaction.reload({
      include: [{ model: Category, as: 'category' }],
    });

    if (type === 'expense') {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const budget = await Budget.findOne({
        where: {
          userId: req.user.id,
          categoryId: category,
          month: monthStart,
        },
      });

      if (budget) {
        budget.spent = parseFloat(budget.spent) + parseFloat(amount);
        await budget.save();
      }
    }

    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/transactions
// @desc    Get all transactions for user
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10, search } = req.query;

    let where = { userId: req.user.id };

    if (type) where.type = type;
    if (category) where.categoryId = category;

    if (search) {
      where = {
        ...where,
        [Op.or]: [
          { description: { [Op.like]: `%${search}%` } },
          { notes: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate);
      if (endDate) where.date[Op.lte] = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: [['date', 'DESC']],
      offset: skip,
      limit: parseInt(limit),
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this transaction',
      });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this transaction',
      });
    }

    const oldAmount = parseFloat(transaction.amount);
    await transaction.update(req.body);
    await transaction.reload({
      include: [{ model: Category, as: 'category' }],
    });

    if (oldAmount !== parseFloat(transaction.amount) && transaction.type === 'expense') {
      const monthStart = new Date(transaction.date.getFullYear(), transaction.date.getMonth(), 1);
      const difference = parseFloat(transaction.amount) - oldAmount;
      const budget = await Budget.findOne({
        where: {
          userId: req.user.id,
          categoryId: transaction.categoryId,
          month: monthStart,
        },
      });

      if (budget) {
        budget.spent = parseFloat(budget.spent) + difference;
        await budget.save();
      }
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction',
      });
    }

    if (transaction.type === 'expense') {
      const monthStart = new Date(transaction.date.getFullYear(), transaction.date.getMonth(), 1);
      const budget = await Budget.findOne({
        where: {
          userId: req.user.id,
          categoryId: transaction.categoryId,
          month: monthStart,
        },
      });

      if (budget) {
        budget.spent = Math.max(0, parseFloat(budget.spent) - parseFloat(transaction.amount));
        await budget.save();
      }
    }

    await transaction.destroy();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted',
    });
  } catch (error) {
    next(error);
  }
};
