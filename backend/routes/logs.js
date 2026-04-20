import express from 'express';
import logger from '../logger/logger.js';

const route = express.Router();

// Endpoint for receiving frontend logs
route.post('/logs', (req, res) => {
    const { level, message, details } = req.body;

    // Fallback defaults if payload is malformed
    const logMsg = message || 'Frontend log received without message';
    const logDetails = details || {};

    switch (level) {
        case 'error':
            logger.error(`[FRONTEND] ${logMsg}`, { details: logDetails });
            break;
        case 'warn':
            logger.warn(`[FRONTEND] ${logMsg}`, { details: logDetails });
            break;
        case 'info':
        default:
            logger.info(`[FRONTEND] ${logMsg}`, { details: logDetails });
            break;
    }

    res.status(200).json({ status: 'Log received' });
});

export default route;
