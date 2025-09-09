// middlewares/errorHandler.js
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  // Log automatico: errori operativi noti = warn, bug imprevisti = error
  const status = err.statusCode || 500;
  const level  = err.isOperational ? 'warn' : 'error';

  logger.log({
    level,
    message: err.message,
    statusCode: status,
    method: req.method,
    path: req.originalUrl,
    user: req.userId || 'anonimo',
    stack: err.stack
  });

  res.status(status).json({
    success: false,
    error: { message: err.message || 'Errore interno del server' }
  });
};
