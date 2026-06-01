import usersModel from '../models/users.js'
import { generarToken, generarRefreshToken, verificarRefreshToken } from '../helpers/autentication.js'
import logger from '../logger/logger.js'
import { uploadToCloudinary } from '../helpers/cloudinaryUpload.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

class usersController {
    constructor() {

    }

    async create(req, res) {
        const { nom, cognom1, cognom2, email, username, rol } = req.body
        let imatge = req.body.imatge;
        try {
            if (req.file) {
                imatge = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
            }

            const generatedPassword = crypto.randomBytes(4).toString('hex');
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            const data = await usersModel.create({ nom, cognom1, cognom2, email, username, password: hashedPassword, imatge, rol, mustChangePassword: true })
            logger.info(`Usuario creado: ${username}`);
            const { password, ...safeData } = data.toObject();
            res.status(201).json({ ...safeData, generatedPassword })
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

            const data = await usersModel.create({ nom, cognom1, cognom2, email, username, password: passwordEncryptada, imatge, rol, mustChangePassword: false })

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
            let generatedPassword = null;
            if (password) {
                generatedPassword = crypto.randomBytes(4).toString('hex');
                updatedData.password = await bcrypt.hash(generatedPassword, 10);
                updatedData.mustChangePassword = true;
            }

            const data = await usersModel.update(id, updatedData)
            logger.info(`Usuario actualizado: ${id}`);
            const { password: pwd, ...safeData } = data.toObject();
            res.status(200).json({ ...safeData, generatedPassword })
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
                // Verificamos el temporizador de bloqueo
                if (data.bloqueado_hasta && data.bloqueado_hasta > new Date()) {
                    const tiempoRestante = Math.ceil((data.bloqueado_hasta - new Date()) / 60000); // minutos restantes
                    logger.warn(`Intento de login en cuenta bloqueada temporalmente: ${username}`);
                    return res.status(423).json({
                        ok: false,
                        msg: `La cuenta está bloqueada temporalmente. Inténtalo de nuevo en ${tiempoRestante} minutos.`
                    });
                }

                // Comparamos la contraseña encriptada
                const passwordValida = await bcrypt.compare(password, data.password)
                if (!passwordValida) {
                    const usuarioActualizado = await usersModel.getOne(data.id);
                    // Si el bloqueo ha expirado, los intentos actuales parten desde 0
                    const expirado = usuarioActualizado && usuarioActualizado.bloqueado_hasta && usuarioActualizado.bloqueado_hasta <= new Date();
                    const intentosActuales = expirado ? 0 : (usuarioActualizado ? (usuarioActualizado.intentos_fallidos || 0) : (data.intentos_fallidos || 0));
                    
                    const nuevosIntentos = intentosActuales + 1;
                    let bloqueado_hasta = null;
                    
                    if (nuevosIntentos >= 3) {
                        bloqueado_hasta = new Date(Date.now() + 15 * 60 * 1000); // Bloqueo de 15 minutos
                    }
                    
                    await usersModel.update(data.id, { intentos_fallidos: nuevosIntentos, bloqueado_hasta });
                    logger.warn(`Login fallido: contraseña incorrecta para ${username}`);
                    
                    if (nuevosIntentos >= 3) {
                        return res.status(423).json({ ok: false, msg: `Has fallado demasiadas veces. Cuenta bloqueada por 15 minutos.` });
                    } else {
                        const intentosRestantes = 3 - nuevosIntentos;
                        return res.status(401).json({ ok: false, msg: `Usuari o contrasenya incorrectes, queden ${intentosRestantes} intents` })
                    }
                }

                const token = generarToken(data.id, data.rol)
                const refreshToken = generarRefreshToken(data.id, data.rol)

                // Guardar refresh token en DB y limpiar bloqueos
                await usersModel.update(data.id, { refreshToken, intentos_fallidos: 0, bloqueado_hasta: null });

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 5 * 60 * 1000 // 5 minutos
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
                    path: '/api/renewToken'// ← Esto es para que esta cookie solo se envíe a la ruta definida
                });

                logger.info(`Login correcto: ${username}`);
                res.status(200).json({ username: data.username, rol: data.rol, id: data.id, mustChangePassword: data.mustChangePassword })
            } else {
                logger.warn(`Login fallido: usuario no encontrado ${username}`);
                res.status(401).json({ ok: false, msg:`Usuari o contrasenya incorrectes` })
            }
        } catch (e) {
            logger.error(`Error en login para ${username}: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async logout(req, res) {
        try {

            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/api/renewToken' // <-- Clave para que el navegador la borre con éxito
            });

            const refreshToken = req.cookies?.refreshToken;
            if (refreshToken) {
                const dataToken = verificarRefreshToken(refreshToken);
                if (dataToken && dataToken.id) {
                    await usersModel.update(dataToken.id, { refreshToken: null });
                    logger.info(`Refresh token eliminado de la DB para el usuario: ${dataToken.id}`);
                }
            }

            return res.status(200).json({ ok: true, msg: 'Sesión cerrada correctamente' });
        } catch (e) {
            logger.error(`Error en logout: ${e.message || e}`);
            return res.status(500).json({ ok: false, msg: 'Error al cerrar sesión' });
        }
    }

    async changePassword(req, res) {
        const { newPassword } = req.body
        const userId = req.userId
        try {
            if (!newPassword || newPassword.length < 6) {
                return res.status(400).json({ ok: false, msg: 'La contrasenya ha de tenir almenys 6 caràcters' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await usersModel.update(userId, { password: hashedPassword, mustChangePassword: false });

            logger.info(`Contrasenya canviada per usuari: ${userId}`);
            res.status(200).json({ ok: true, msg: 'Contrasenya canviada correctament' });
        } catch (e) {
            logger.error(`Error canviant contrasenya per ${userId}: ${e.message || e}`);
            res.status(500).json({ ok: false, msg: 'Error al canviar la contrasenya' });
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