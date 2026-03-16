import swaggerAutogen from 'swagger-autogen'

const outputFile = './swagger.json'
const endpointsFiles = ['./server.js']

const doc = {
    swagger: "2.0",
    info: {
        title: 'Gestor de Permisos Laborales API',
        description: 'API para la gestión de permisos laborales y usuarios',
        version: "1.0.0"
    },
    host: 'localhost:3000',
    schemes: ['http']
}

swaggerAutogen()(outputFile, endpointsFiles, doc)
