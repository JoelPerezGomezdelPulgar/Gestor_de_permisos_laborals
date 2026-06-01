import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import 'dotenv/config'
import dbClient from './db/dbClient.js'
import emailRoutes from './routes/email.js'
import adminRoutes from './routes/admin.js'
import logsRoutes from './routes/logs.js'
import swaggerUi from 'swagger-ui-express'
import logger from './logger/logger.js'

import { readFile } from 'fs/promises';
const swaggerDocument = JSON.parse(await readFile(new URL('./swagger.json', import.meta.url)));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.set('io', io);

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(cookieParser());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use('/api', emailRoutes);
app.use('/api', adminRoutes);
app.use('/api', logsRoutes);

app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

const PORT = process.env.PORT || 5100;

httpServer.listen(PORT, () => {
    logger.info(`Servidor corriendose en el puerto ${PORT}`);
});
