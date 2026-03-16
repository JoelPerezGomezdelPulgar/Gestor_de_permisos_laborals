import mongoose from 'mongoose'
import User from '../schemas/users.js'

class usersModel {
    async create(user) {
        return await User.create(user)
    }

    async update(id, user) {
        return await User.findByIdAndUpdate(id, user, { new: true })
    }

    async getAll() {
        return await User.find()
    }

    async getOne(id) {
        return await User.findById(id)
    }

    async getOneByEmail(email) {
        return await User.findOne({ email })
    }

    async login(username, password) {
        return await User.findOne({ username, password })
    }

    async delete(id) {
        return await User.findByIdAndDelete(id)
    }

}

export default new usersModel()