// Importamos las dependecias
import 'dotenv/config'
import jsonwebtoken from 'jsonwebtoken'

// Método que genera un token mediante el correo electrónico cada vez que un usuario inicia sesión
export function generarToken(id, rol) {
    return jsonwebtoken.sign({ id, rol }, process.env.JWT_TOKEN_SECRET, { expiresIn: '15m' })
}

export function generarRefreshToken(id, rol) {
    return jsonwebtoken.sign({ id, rol }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

// Método que verifica el token para ver si el introducido coincide con el último generado
export function verificarToken(req, res, next) {

    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' })
    }

    try {
        const dataToken = jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET)
        req.userId = dataToken.id
        req.userRole = dataToken.rol
        next()
    } catch (e) {
        console.log(e);
        res.status(401).json({ error: 'Token no válido' })
    }

}

export function verificarRefreshToken(token) {
    try {
        return jsonwebtoken.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (e) {
        return null
    }
}