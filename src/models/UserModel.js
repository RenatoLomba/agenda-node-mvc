const mongoose = require('mongoose');
const validator = require('validator').default;
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model('User', UserSchema);

class User {
    constructor(body) {
        this.data = {
            email: String(body.email),
            password: String(body.password)
        };
        this.errors = [];
        this.user = null;
    }

    validate() {
        if (!validator.isEmail(this.data.email)) {
            this.errors.push('Email inválido');
        }

        if (this.data.password.length < 3 || this.data.password.length > 50) {
            this.errors.push('Senha deve ter entre 3 e 50 caracteres');
        }
    }

    async getUser() {
        this.user = await UserModel.findOne({ email: this.data.email });
        return;
    }

    async register() {
        this.validate();
        if (this.errors.length > 0) return;

        await this.getUser();
        if (this.user) this.errors.push('Usuário com este email já cadastrado');
        if (this.errors.length > 0) return;

        const salt = bcrypt.genSaltSync();
        this.data.password = bcrypt.hashSync(this.data.password, salt);

        try {
            this.user = await UserModel.create(this.data);
        } catch (error) {
            this.errors.push(error.message);
        }
    }

    async login() {
        this.validate();
        if (this.errors.length > 0) return;

        await this.getUser();
        if (!this.user) {
            this.errors.push('Usuário não cadastrado');
            return;
        }

        if (!bcrypt.compareSync(this.data.password, this.user.password)) {
            this.errors.push('Senha incorreta');
            this.user = null;
            return;
        }
    }
}

module.exports = User;
