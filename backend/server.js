import express from 'express'

const app = express();

app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});