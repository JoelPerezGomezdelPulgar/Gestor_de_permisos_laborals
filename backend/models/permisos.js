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
        return await Permiso.find().populate('empId')
    }

    async getAllByUserName(userName) {
        console.log(`Fetching permisos for user: ${userName}`);
        return await Permiso.find({ empId: userName }).populate('empId')
    }

    async delete(id) {
        return await Permiso.findByIdAndDelete(id)
    }

}

export default new permisosModel()