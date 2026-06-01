import TipusPermis from '../schemas/tipusPermisos.js'

class tipusPermisosModel {
    async create(data) {
        return await TipusPermis.create(data)
    }

    async getAll() {
        return await TipusPermis.find({ actiu: true })
    }

    async getAllAdmin() {
        return await TipusPermis.find()
    }

    async getById(id) {
        return await TipusPermis.findById(id)
    }

    async update(id, data) {
        return await TipusPermis.findByIdAndUpdate(id, data, { new: true })
    }

    async delete(id) {
        return await TipusPermis.findByIdAndDelete(id)
    }

    async getByNom(nom) {
        return await TipusPermis.findOne({ nom })
    }
}

export default new tipusPermisosModel()
