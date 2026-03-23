import express from 'express'
import permisController from '../crud/permisos.js'
import { verificarToken } from '../helpers/autentication.js'

const route = express.Router()

route.post('/permis', verificarToken, permisController.create)
route.get('/permis', verificarToken, permisController.getAll)

export default route