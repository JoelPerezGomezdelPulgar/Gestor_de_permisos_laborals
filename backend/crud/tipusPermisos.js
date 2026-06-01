import tipusPermisosModel from '../models/tipusPermisos.js'
import logger from '../logger/logger.js'

const DEFAULT_TIPUS = [
    { nom: 'hospitalitzacio', descripcio: 'Hospitalització' },
    { nom: 'matrimoni', descripcio: 'Matrimoni' },
    { nom: 'trasllat', descripcio: 'Trasllat de domicili' },
    { nom: 'malaltia', descripcio: 'Malaltia' },
    { nom: 'naixement', descripcio: 'Naixement de fill/a' },
    { nom: 'vacances', descripcio: 'Vacances' },
    { nom: 'altres', descripcio: 'Altres' }
]

async function seedIfEmpty() {
    try {
        const count = await tipusPermisosModel.getAllAdmin()
        if (count.length === 0) {
            for (const t of DEFAULT_TIPUS) {
                await tipusPermisosModel.create(t)
            }
            logger.info('Tipus de permisos per defecte insertats')
        }
    } catch (e) {
        logger.error(`Error seeding tipus permisos: ${e.message || e}`)
    }
}

class tipusPermisosController {

    async create(req, res) {
        const { nom, descripcio } = req.body
        try {
            const existing = await tipusPermisosModel.getByNom(nom)
            if (existing) {
                return res.status(400).json({ ok: false, msg: 'Ja existeix un tipus amb aquest nom' })
            }
            const data = await tipusPermisosModel.create({ nom, descripcio })
            logger.info(`Tipus permís creat: ${nom}`)
            res.status(201).json(data)
        } catch (e) {
            logger.error(`Error creant tipus permís: ${e.message || e}`)
            res.status(500).send(e)
        }
    }

    async getAll(req, res) {
        try {
            await seedIfEmpty()
            const data = await tipusPermisosModel.getAll()
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error obtenint tipus permisos: ${e.message || e}`)
            res.status(500).send(e)
        }
    }

    async getAllAdmin(req, res) {
        try {
            await seedIfEmpty()
            const data = await tipusPermisosModel.getAllAdmin()
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error obtenint tipus permisos: ${e.message || e}`)
            res.status(500).send(e)
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { nom, descripcio, actiu } = req.body
        try {
            const data = await tipusPermisosModel.update(id, { nom, descripcio, actiu })
            logger.info(`Tipus permís actualitzat: ${id}`)
            res.status(200).json(data)
        } catch (e) {
            logger.error(`Error actualitzant tipus permís ${id}: ${e.message || e}`)
            res.status(500).send(e)
        }
    }

    async delete(req, res) {
        const { id } = req.params
        try {
            await tipusPermisosModel.delete(id)
            logger.info(`Tipus permís eliminat: ${id}`)
            res.status(200).json({ ok: true, msg: 'Tipus de permís eliminat' })
        } catch (e) {
            logger.error(`Error eliminant tipus permís ${id}: ${e.message || e}`)
            res.status(500).send(e)
        }
    }
}

export default new tipusPermisosController()
