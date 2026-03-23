// Importamos las dependecias
import 'dotenv/config'
import mongoose from 'mongoose'

// Creamos la clase dbClient que se encarga de la conexión
class dbClient {
    constructor() {
        this.conectarBaseDatos()
    }

    // Método para conectar a la base de datos
    async conectarBaseDatos() {
        const user = encodeURIComponent(process.env.USER_DB);
        const pass = encodeURIComponent(process.env.PWD_DB);
        const queryString = `mongodb+srv://${user}:${pass}@${process.env.SERVER_DB}/?appName=GestorDePermisosLaborals`
        try {
            await mongoose.connect(queryString)
            console.log("✅ Conectado a la base de datos");
        } catch (e) {
            console.error("❌ Error de conexión a la base de datos:");
            if (e.message.includes('Authentication failed')) {
                console.error("   Parece un error de credenciales (usuario o contraseña incorrectos en .env)");
            } else {
                console.error("  ", e.message);
            }
        }
    }

    // Método para cerrar la conexión
    async cerrarConexion() {
        try {
            await mongoose.disconnect()
            console.log("Conexión a la base de datos cerrada");
        } catch (e) {
            console.log("Error al cerrar la conexión:", e);

        }
    }
}

// Exportamos la clase
export default new dbClient();