import mongoose from "mongoose"

const usuariosSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true,
            trim: true,
        },
        cognom1: {
            type: String,
            required: true,
            trim: true,
        },
        cognom2: {
            type: String,
            required: false,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        imatge: {
            type: String,
            required: false,
            trim: true,
        },
        rol: {
            type: String,
            required: true,
            enum: ['admin', 'usuari']
        }
    },
    { timestamps: true }
)


export default mongoose.model('usuarios', usuariosSchema)