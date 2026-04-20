import permisosModel from '../models/permisos.js'
import usersModel from '../models/users.js'
import logger from '../logger/logger.js'

class permisosController {
    constructor() {

    }

    async getDashboardData(req, res) {
        try {
            // 1. Get stats
            const allPermisos = await permisosModel.getAll();
            const stats = {
                pendent: allPermisos.filter(p => p.estat === 'pendent').length,
                aprovat: allPermisos.filter(p => p.estat === 'aprovat').length,
                refusat: allPermisos.filter(p => p.estat === 'refusat').length
            };

            // 2. Get 3 most recent users
            const allUsers = await usersModel.getAll();
            // Assuming we want the last 3 based on the array order or createdAt if available
            // Since I just added timestamps, let's try to sort if possible, or just slice the last 3
            const recentUsers = allUsers.slice(-3).reverse();

            // 3. Get 3 most recent permissions
            // We should populate the user info if possible
            const recentPermissions = allPermisos.slice(-3).reverse();

            res.status(200).json({
                stats,
                recentUsers,
                recentPermissions
            });
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
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error fetching all permisos: ${e.message || e}`);
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