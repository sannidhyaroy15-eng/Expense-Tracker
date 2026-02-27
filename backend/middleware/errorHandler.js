const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors?.map((e) => e.message).join(', ') || err.message;
    err.statusCode = 400;
    err.message = message;
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    err.statusCode = 500;
    err.message = 'Database error occurred';
    console.error('Database error:', err);
  }

  // Mongoose validation error (legacy support)
  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    err.statusCode = 400;
    err.message = message;
  }

  // Mongoose duplicate key error (legacy support)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err.statusCode = 400;
    err.message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Token expired';
  }

  console.error('Error:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
  });

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandler;
