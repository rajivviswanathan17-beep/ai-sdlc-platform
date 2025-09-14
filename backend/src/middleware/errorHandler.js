const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }
  
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }
  
  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error = { 
          message: 'Duplicate entry. This record already exists.', 
          statusCode: 400 
        };
        break;
      case '23503': // Foreign key violation
        error = { 
          message: 'Referenced record does not exist.', 
          statusCode: 400 
        };
        break;
      case '23502': // Not null violation
        error = { 
          message: 'Required field is missing.', 
          statusCode: 400 
        };
        break;
      case '22001': // String data too long
        error = { 
          message: 'Input data is too long.', 
          statusCode: 400 
        };
        break;
      default:
        error = { 
          message: 'Database error occurred.', 
          statusCode: 500 
        };
    }
  }
  
  // Joi validation errors
  if (err.isJoi) {
    const message = err.details.map(detail => detail.message).join(', ');
    error = { message, statusCode: 400 };
  }
  
  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = { 
      message: 'File too large. Maximum size is 10MB.', 
      statusCode: 400 
    };
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    error = { 
      message: 'Too many files. Maximum is 10 files.', 
      statusCode: 400 
    };
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = { 
      message: 'Unexpected file field.', 
      statusCode: 400 
    };
  }
  
  // OpenAI API errors
  if (err.type === 'invalid_request_error') {
    error = { 
      message: 'AI service request error. Please check your input.', 
      statusCode: 400 
    };
  }
  
  if (err.type === 'authentication_error') {
    error = { 
      message: 'AI service authentication failed.', 
      statusCode: 500 
    };
  }
  
  if (err.type === 'rate_limit_error') {
    error = { 
      message: 'AI service rate limit exceeded. Please try again later.', 
      statusCode: 429 
    };
  }
  
  if (err.type === 'insufficient_quota') {
    error = { 
      message: 'AI service quota exceeded. Please contact support.', 
      statusCode: 503 
    };
  }
  
  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  // Don't expose internal errors in production
  const response = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : message
  };
  
  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    response.error = {
      type: err.name || 'Error',
      stack: err.stack,
      details: err
    };
  }
  
  // Include request ID for tracking
  if (req.requestId) {
    response.requestId = req.requestId;
  }
  
  res.status(statusCode).json(response);
};

module.exports = errorHandler;