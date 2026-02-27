const Category = require('../models/Category');

// @route   GET /api/categories
// @desc    Get all categories (default + user's custom)
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { isDefault: true },
          { userId: req.user.id },
        ],
      },
      order: [['isDefault', 'DESC'], ['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/categories
// @desc    Create custom category
// @access  Private
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, color, type } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name',
      });
    }

    const category = await Category.create({
      name,
      description,
      icon: icon || '📁',
      color: color || '#3B82F6',
      type: type || 'both',
      userId: req.user.id,
      isDefault: false,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (category.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Cannot edit default categories',
      });
    }

    if (category.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this category',
      });
    }

    await category.update(req.body);

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (category.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete default categories',
      });
    }

    if (category.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this category',
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    next(error);
  }
};
