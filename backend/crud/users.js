import usersModel from '../models/users.js'
import { generarToken } from '../helpers/autentication.js'
import logger from '../logger/logger.js'
import { uploadToCloudinary } from '../helpers/cloudinaryUpload.js'

class usersController {
    constructor() {

    }

    async create(req, res) {
        const { nom, cognom1, cognom2, email, username, password, rol } = req.body
        let imatge = req.body.imatge;
        try {
            if (req.file) {
                imatge = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
            }
            const data = await usersModel.create({ nom, cognom1, cognom2, email, username, password, imatge, rol })
            logger.info(`Usuario creado: ${username}`);
            res.status(201).json(data)
        } catch (e) {
            logger.error(`Error creando usuario: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async register(req, res) {
        const { nom, cognom1, cognom2, email, username, password } = req.body
        const rol = 'usuari'; // Forzamos el rol básico
        let imatge = req.body.imatge;
        try {
            if (req.file) {
                imatge = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
            }
            const data = await usersModel.create({ nom, cognom1, cognom2, email, username, password, imatge, rol })

            const token = generarToken(data.id, data.rol);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000 // 15 minutos
            });

            logger.info(`Nuevo usuario registrado públicamente: ${username}`);
            res.status(201).json(data)
        } catch (e) {
            logger.error(`Error en autorregistro: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async getAll(req, res) {
        try {
            const data = await usersModel.getAll()
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error obteniendo usuarios: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { nom, cognom1, cognom2, email, username, password, rol } = req.body
        let imatge = req.body.imatge;
        try {
            if (req.file) {
                imatge = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
            }
            const data = await usersModel.update(id, { nom, cognom1, cognom2, email, username, password, imatge, rol })
            logger.info(`Usuario actualizado: ${id}`);
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error actualizando usuario ${id}: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async delete(req, res) {
        const { id } = req.params
        try {
            const data = await usersModel.delete(id)
            logger.info(`Usuario borrado: ${id}`);
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error borrando usuario ${id}: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async getOne(req, res) {
        const { id } = req.params
        try {
            const data = await usersModel.getOne(id)
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error obteniendo usuario ${id}: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async login(req, res) {
        const { username, password } = req.body
        try {
            const data = await usersModel.login(username, password)
            if (data) {
                const token = generarToken(data.id, data.rol)

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60 * 1000 // 15 minutos
                });

                const userObj = data.toObject();
                delete userObj.password;
                logger.info(`Login correcto: ${username}`);
                res.status(200).json(userObj)
            } else {
                logger.warn(`Login fallido: credenciales incorrectas para ${username}`);
                res.status(401).json({ ok: false, msg: 'Usuari o contrasenya incorrectes' })
            }
        } catch (e) {
            logger.error(`Error en login para ${username}: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async logout(req, res) {
        res.clearCookie('token');
        res.status(200).json({ ok: true, msg: 'Sesión cerrada' });
    }

    async getMe(req, res) {
        try {
            const user = await usersModel.getOne(req.userId);
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            const userObj = user.toObject();
            delete userObj.password;
            res.status(200).json(userObj);
        } catch (e) {
            res.status(500).send(e);
        }
    }

}

export default new usersController()