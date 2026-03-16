import usersModel from '../models/users.js'

class usersController {
    constructor() {

    }

    async create(req, res) {
        const { nom, cognom1, cognom2, email, username, password, imatge, rol } = req.body
        try {
            const data = await usersModel.create({ nom, cognom1, cognom2, email, username, password, imatge, rol })
            res.status(201).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getAll(req, res) {
        try {
            const data = await usersModel.getAll()
            res.status(200).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { nom, cognom1, cognom2, email, username, password, imatge, rol } = req.body
        try {
            const data = await usersModel.update(id, { nom, cognom1, cognom2, email, username, password, imatge, rol })
            res.status(200).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async delete(req, res) {
        const { id } = req.params
        try {
            const data = await usersModel.delete(id)
            res.status(200).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getOne(req, res) {
        const { id } = req.params
        try {
            const data = await usersModel.getOne(id)
            res.status(200).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async login(req, res) {
        const { username, password } = req.body
        try {
            const data = await usersModel.login(username, password)
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(401).json({ ok: false, msg: 'Usuari o contrasenya incorrectes' })
            }
        } catch (e) {
            res.status(500).send(e)
        }
    }

}

export default new usersController()