import usersModel from '../models/users.js'
import { generarToken, generarRefreshToken, verificarRefreshToken } from '../helpers/autentication.js'
import logger from '../logger/logger.js'
import { uploadToCloudinary } from '../helpers/cloudinaryUpload.js'
import bcrypt from 'bcryptjs'

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

            // Hashing password for admin-created users
            let hashedPassword = password;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            const data = await usersModel.create({ nom, cognom1, cognom2, email, username, password: hashedPassword, imatge, rol })
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

            const passwordEncryptada = await bcrypt.hash(password, 10);

            const data = await usersModel.create({ nom, cognom1, cognom2, email, username, password: passwordEncryptada, imatge, rol })
 
            const token = generarToken(data.id, data.rol);
            const refreshToken = generarRefreshToken(data.id, data.rol);

            // Guardar refresh token en DB
            await usersModel.update(data.id, { refreshToken });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000 // 15 minutos
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
            });

            logger.info(`Nuevo usuario registrado públicamente: ${username}`);
            res.status(201).json({ username: data.username, rol: data.rol })
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

            let updatedData = { nom, cognom1, cognom2, email, username, imatge, rol };
            if (password) {
                updatedData.password = await bcrypt.hash(password, 10);
            }

            const data = await usersModel.update(id, updatedData)
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
            // Buscamos el usuario por username
            const data = await usersModel.login(username)
            if (data) {
                // Comparamos la contraseña encriptada
                const passwordValida = await bcrypt.compare(password, data.password)
                if (!passwordValida) {
                    logger.warn(`Login fallido: contraseña incorrecta para ${username}`);
                    return res.status(401).json({ ok: false, msg: `Usuari o contrasenya incorrectes, ${passwordValida}` })
                }

                const token = generarToken(data.id, data.rol)
                const refreshToken = generarRefreshToken(data.id, data.rol)

                // Guardar refresh token en DB
                await usersModel.update(data.id, { refreshToken });

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60 * 1000 // 15 minutos
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
                });

                logger.info(`Login correcto: ${username}`);
                res.status(200).json({ username: data.username, rol: data.rol })
            } else {
                logger.warn(`Login fallido: usuario no encontrado ${username}`);
                res.status(401).json({ ok: false, msg: 'Usuari o contrasenya incorrectes' })
            }
        } catch (e) {
            logger.error(`Error en login para ${username}: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async logout(req, res) {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
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

    async renewToken(req, res) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token requerido' });
        }

        const dataToken = verificarRefreshToken(refreshToken);
        if (!dataToken) {
            return res.status(401).json({ error: 'Refresh token no válido o expirado' });
        }

        // Verificar que el token coincide con el de la DB
        const user = await usersModel.getOne(dataToken.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'Token de actualización revocado o inválido' });
        }

        const newToken = generarToken(dataToken.id, dataToken.rol);
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000 // 15 minutos
        });

        res.status(200).json({ ok: true, msg: 'Token renovado' });
    }

}

export default new usersController()