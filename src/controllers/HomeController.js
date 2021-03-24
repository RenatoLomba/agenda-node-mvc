const Contato = require('../models/ContatoModel');

exports.index = async (req, res, next) => {
    const contatos = await Contato.getAll();

    res.render('index', { contatos });
    return;
}
