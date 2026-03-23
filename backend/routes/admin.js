import express from 'express'
import userController from '../crud/users.js'
import permisController from '../crud/permisos.js'
import { verificarToken } from '../helpers/autentication.js'

const route = express.Router()

route.post('/login', userController.login)

route.post('/user', verificarToken, userController.create)
route.put('/user/:id', verificarToken, userController.update)
route.get('/user', verificarToken, userController.getAll)
route.get('/user/:id', verificarToken, userController.getOne)
route.delete('/user/:id', verificarToken, userController.delete)

route.post('/permis', verificarToken, permisController.create)
route.put('/permis/:id', verificarToken, permisController.update)
route.get('/permis', verificarToken, permisController.getAll)
route.delete('/permis/:id', verificarToken, permisController.delete)


export default route