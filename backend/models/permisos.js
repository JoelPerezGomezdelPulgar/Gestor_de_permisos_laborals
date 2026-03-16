import mongoose from 'mongoose'
import Permiso from '../schemas/permisos.js'

class permisosModel {
    async create(permiso) {
        return await Permiso.create(permiso)
    }

    async update(id, permiso) {
        return await Permiso.findByIdAndUpdate(id, permiso, { new: true })
    }

    async getAll() {
        return await Permiso.find()
    }

    async delete(id) {
        return await Permiso.findByIdAndDelete(id)
    }

}

export default new permisosModel()