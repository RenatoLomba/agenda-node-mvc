const mongoose = require('mongoose');
const validator = require('validator').default;

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    snome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    created_at: { type: Date, default: Date.now }
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
    this.data = {
        nome: String(body.nome),
        snome: String(body.snome),
        email: String(body.email),
        telefone: String(body.telefone)
    };
    this.errors = [];
    this.contato = null;
}

Contato.prototype.validate = function () {
    if (!this.data.nome && validator.isEmpty(this.data.nome)) {
        this.errors.push('Nome deve ser informado');
    }
    if (this.data.email && !validator.isEmail(this.data.email)) {
        this.errors.push('Email inválido');
    }
    if (!this.data.email && !this.data.telefone && validator.isEmpty(this.data.email) && validator.isEmpty(this.data.telefone)) {
        this.errors.push('Necessário informar alguma forma de contato (Email ou telefone)');
    }
}

Contato.prototype.register = async function() {
    this.validate();
    if (this.errors.length > 0) return;

    try {
        this.contato = await ContatoModel.create(this.data);
    } catch (error) {
        this.errors.push(error.message);
    }
}

Contato.getById = async function (id) {
    const contato = await ContatoModel.findById(String(id));
    return contato;
}

Contato.getAll = async function () {
    const contatos = await ContatoModel.find();
    return contatos;
}

Contato.delete = async function (id) {
    const contato = await ContatoModel.findByIdAndDelete(id);
    return contato;
}

Contato.prototype.edit = async function (id) {
    this.validate();
    if (this.errors.length > 0) return;

    try {
        this.contato = await ContatoModel.findByIdAndUpdate(String(id), this.data, { new: true });
    } catch (error) {
        this.errors.push(error.message);
    }
}

module.exports = Contato;
