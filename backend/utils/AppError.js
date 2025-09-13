//definsce una classe di errore personalizzata per gestire gli errori
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // flag per distinguere errori “previsti” da bug imprevisti
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
