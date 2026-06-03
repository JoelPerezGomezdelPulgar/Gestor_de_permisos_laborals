import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json } = format;
import fs from 'fs';
import path from 'path';

const dir = process.env.LOG_DIR || path.resolve('logs');

try {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
} catch (e) {
  console.error(`No se pudo crear el directorio de logs (${dir}):`, e.message);
}

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({ format: format.simple() }),
  ],
});

try {
  logger.add(new transports.File({ filename: path.join(dir, 'error.log'), level: 'error' }));
  logger.add(new transports.File({ filename: path.join(dir, 'combined.log') }));
} catch (e) {
  console.error('No se pudieron inicializar los transports de archivo:', e.message);
}

export default logger;