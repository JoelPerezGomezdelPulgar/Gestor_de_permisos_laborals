import mongoose from 'mongoose'
import User from '../schemas/users.js'

class usersModel {
    async create(user) {
        return await User.create(user)
    }

    async update(id, info) {
        return await User.findByIdAndUpdate(id, info, { new: true })
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

    async login(username) {
        return await User.findOne({ username })
    }

    async delete(id) {
        return await User.findByIdAndDelete(id)
    }

}

export default new usersModel()