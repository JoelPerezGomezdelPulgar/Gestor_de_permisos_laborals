import express from 'express'
import userController from '../crud/users.js'
import permisController from '../crud/permisos.js'
import { verificarToken } from '../helpers/autentication.js'
import { upload } from '../helpers/cloudinaryUpload.js'

const route = express.Router()

route.post('/login', userController.login)
route.post('/register', upload.single('imatge'), userController.register)
// Si usamos upload, multer procesará el multipart/form-data y pondrá el archivo en req.file antes de que userController.create lo maneje
route.post('/user', verificarToken, upload.single('imatge'), userController.create)
route.put('/user/:id', verificarToken, upload.single('imatge'), userController.update)
route.get('/me', verificarToken, userController.getMe)
route.post('/logout', userController.logout)
route.post('/refresh-token', userController.renewToken)

route.get('/user', verificarToken, userController.getAll)
route.get('/user/:id', verificarToken, userController.getOne)
route.delete('/user/:id', verificarToken, userController.delete)

route.post('/permis', verificarToken, permisController.create)
route.put('/permis/:id', verificarToken, permisController.update)
route.get('/permis', verificarToken, permisController.getAll)
route.get('/dashboard', verificarToken, permisController.getDashboardData)
route.delete('/permis/:id', verificarToken, permisController.delete)


export default route