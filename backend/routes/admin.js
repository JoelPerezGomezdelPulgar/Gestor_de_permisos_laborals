import express from 'express'
import userController from '../crud/users.js'
import permisController from '../crud/permisos.js'
import { verificarToken } from '../helpers/autentication.js'
import { upload } from '../helpers/cloudinaryUpload.js'
import { isAdmin } from '../helpers/administrator.js'

const route = express.Router()

route.post('/login', userController.login)
route.post('/register', isAdmin, upload.single('imatge'), userController.register)
// Si usamos upload, multer procesará el multipart/form-data y pondrá el archivo en req.file antes de que userController.create lo maneje
route.post('/user', verificarToken, isAdmin, upload.single('imatge'), userController.create)
route.put('/user/:id', verificarToken, isAdmin, upload.single('imatge'), userController.update)
route.get('/me', verificarToken, isAdmin, userController.getMe)
route.post('/logout', userController.logout)
route.post('/renewToken', userController.renewToken)

route.get('/user', verificarToken, isAdmin, userController.getAll)
route.get('/user/:id', verificarToken, isAdmin, userController.getOne)
route.delete('/user/:id', verificarToken, isAdmin, userController.delete)

route.post('/permis', verificarToken, permisController.create)
route.put('/permis/:id', verificarToken, isAdmin, permisController.update)
route.get('/permis', verificarToken, permisController.getAll)
route.get('/dashboard', verificarToken, isAdmin, permisController.getDashboardData)
route.delete('/permis/:id', verificarToken, isAdmin, permisController.delete)


export default route