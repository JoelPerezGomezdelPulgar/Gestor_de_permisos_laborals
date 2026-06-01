import mongoose from "mongoose"

const tipusPermisosSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        descripcio: {
            type: String,
            default: '',
            trim: true
        },
        actiu: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('tipus_permisos', tipusPermisosSchema)
