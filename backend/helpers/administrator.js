import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import 'dotenv/config'

export function isAdmin(req, res, next) {
    const SECRET_KEY = process.env.JWT_TOKEN_SECRET;
    try {
        // Obtenemos el token de las cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token no encontrado en las cookies" });
        }

        // Verificamos el token
        const decoded = jwt.verify(token, SECRET_KEY);

        // Si el token es válido, accedemos al rol
        if (decoded.rol === 'admin') {
            req.userId = decoded.id;
            // Guardamos el ID del usuario en la solicitud para uso futuro
            next(); // Pasamos al siguiente middleware
        } else {
            res.status(401).json({ message: "No tienes permisos de administrador" });
        }
    } catch (error) {
        // Si el token expiró o la firma no coincide
        console.error("El usuario no es administrador:", error.message);
        res.status(401).json({ message: "Token no válido" });
    }
}
