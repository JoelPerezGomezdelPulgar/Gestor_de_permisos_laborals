import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import emailRoutes from './routes/email.js'
import adminRoutes from './routes/admin.js'
import basicoRoutes from './routes/basico.js'
import swaggerUi from 'swagger-ui-express'

import { readFile } from 'fs/promises';
const swaggerDocument = JSON.parse(await readFile(new URL('./swagger.json', import.meta.url)));


const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use('/api', emailRoutes);
app.use('/api', adminRoutes);
app.use('/api', basicoRoutes);

app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
    console.log(`Servidor corriendose en el puerto ${PORT}`);
});
