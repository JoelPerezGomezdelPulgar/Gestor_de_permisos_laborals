import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json, prettyPrint } = format;
import fs from 'fs';
import path from 'path';

let dir = process.env.LOG_DIR ?? "logs";

if (!dir) dir = path.resolve('logs');

// Crear el directorio de logs si no existe
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const logger = createLogger({
  level: 'info', // Nivel mínimo a registrar
  format: combine(
    timestamp(),
    json() // Formato ideal para producción
  ),
  transports: [
    // Guardar logs en archivo
    new transports.File({ filename: path.join(dir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(dir, 'combined.log') }),
  ],
});

// Si no estamos en producción, mostrar logs en consola también
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

export default logger;