import permisosModel from '../models/permisos.js'

class permisosController {
    constructor() {

    }

    async create(req, res) {
        const { dataInici, dataFinal, tipus, descripcio, estat, refId, dataTramitacio } = req.body
        try {
            const data = await permisosModel.create({ dataInici, dataFinal, tipus, descripcio, estat, refId, dataTramitacio })
            res.status(201).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getAll(req, res) {
        try {
            const data = await permisosModel.getAll()
            res.status(200).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { dataInici, dataFinal, tipus, descripcio, estat, refId, dataTramitacio } = req.body
        try {
            const data = await permisosModel.update(id, { dataInici, dataFinal, tipus, descripcio, estat, refId, dataTramitacio })
            res.status(200).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async delete(req, res) {
        const { id } = req.params
        try {
            const data = await permisosModel.delete(id)
            res.status(200).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

}

export default new permisosController()