//Importa le funzioni principali di winston e il trasporto per la rotazione giornaliera dei file di log
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    // File di log per errori, ruotato giornalmente e compresso dopo 14gg
    new DailyRotateFile({
      filename: 'logs/%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,   // comprime i log vecchi
      maxSize: '20m',        // dimensione massima 20MB
      maxFiles: '14d'        // conserva per 14 giorni
    }),
    // File di log per tutti i 'level', ruotato giornalmente e compresso dopo 14gg
    new DailyRotateFile({
      filename: 'logs/%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

// In ambiente di sviluppo aggiunge anche la console come destinazione dei log
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger;

