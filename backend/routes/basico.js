import express from 'express'
import permisController from '../crud/permisos.js'
import userController from '../crud/users.js'

const route = express.Router()

route.post('/permis', permisController.create)
route.get('/permis', permisController.getAll)

export default route