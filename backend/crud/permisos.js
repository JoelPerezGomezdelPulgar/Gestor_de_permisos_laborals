import permisosModel from '../models/permisos.js'
import usersModel from '../models/users.js'
import logger from '../logger/logger.js'

class permisosController {
    constructor() {

    }

    async getDashboardDataPermis(req, res) {
        try {
            // 1. Get stats
            const allPermisos = await permisosModel.getAll();
            const stats = {
                pendent: allPermisos.filter(p => p.estat === 'pendent').length,
                aprovat: allPermisos.filter(p => p.estat === 'aprovat').length,
                refusat: allPermisos.filter(p => p.estat === 'refusat').length
            };

            res.status(200).json({stats});
        } catch (e) {
            logger.error(`Dashboard error: ${e.message || e}`);
            res.status(500).send(e);
        }
    }

    async create(req, res) {
        const { empId, dataInici, dataFinal, tipus, descripcio, estat, refId, dataTramitacio } = req.body
        try {
            const data = await permisosModel.create({ empId, dataInici, dataFinal, tipus, descripcio, estat, refId, dataTramitacio })
            logger.info(`Permiso created for user ${empId}`);
            res.status(201).json(data)
        } catch (e) {
            logger.error(`Error creating permiso: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async getAll(req, res) {
        try {
            const data = await permisosModel.getAll()
            const newData = []
            for (const permiso of data) {
                const user = await usersModel.getOne(permiso.empId)
                permiso.empId = user.username
                newData.push(permiso)
            }
            res.status(200).json(newData)
        } catch (e) {
            logger.error(`Error fetching all permisos: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async getAllByUserName(req, res) {
        try {
            const userId = req.params.id;
            console.log(`------------------------------------ ${userId}`);
            const user = await usersModel.getOne(userId);
            const data = await permisosModel.getAllByUserId(user._id);
            res.status(200).json(data);
        } catch (e) {
            logger.error(`Error fetching permisos for user : ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { empId, dataInici, dataFinal, tipus, descripcio, estat, refId, dataTramitacio } = req.body
        try {
            const data = await permisosModel.update(id, { empId, dataInici, dataFinal, tipus, descripcio, estat, refId, dataTramitacio })
            logger.info(`Permiso ${id} updated to status ${estat || 'N/A'}`);
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error updating permiso ${id}: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

    async delete(req, res) {
        const { id } = req.params
        try {
            const data = await permisosModel.delete(id)
            logger.info(`Permiso ${id} deleted`);
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error deleting permiso ${id}: ${e.message || e}`);
            res.status(500).send(e)
        }
    }

}

export default new permisosController()