import mongoose from "mongoose"

const permisosSchema = new mongoose.Schema(
    {
        empId: {
            type: Number,
            required: true,
        },
        dataInici: {
            type: Date,
            required: true,
        },
        dataFinal: {
            type: Date,
            required: true,
        },
        tipus: {
            type: String,
            required: true,
            trim: true,
            enum: ['hospitalitzacio', 'matrimoni', 'trasllat', 'malaltia', 'naixement', 'vacances', 'altres']
        },
        descripcio: {
            type: String,
            required: true,
            trim: true,
        },
        estat: {
            type: String,
            required: true,
            trim: true,
            enum: ['pendent', 'aprovat', 'refusat'],
            default: 'pendent'
        },
        refId: {
            type: Number,
            required: false,
        },
        dataTramitacio: {
            type: Date,
            required: false,
        }
    }
)


export default mongoose.model('permisos', permisosSchema)