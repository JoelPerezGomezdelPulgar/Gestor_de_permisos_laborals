import express from 'express'
import userController from '../crud/users.js'
import permisController from '../crud/permisos.js'

const route = express.Router()

route.post('/login', userController.login)

route.post('/user', userController.create)
route.put('/user/:id', userController.update)
route.get('/user', userController.getAll)
route.get('/user/:id', userController.getOne)
route.delete('/user/:id', userController.delete)

route.post('/permis', permisController.create)
route.put('/permis/:id', permisController.update)
route.get('/permis', permisController.getAll)
route.delete('/permis/:id', permisController.delete)


export default route