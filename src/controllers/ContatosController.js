const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    return res.render('cadastrar-contato', { contato: {} });
}

exports.registerNew = async (req, res) => {
    const contatoModel = new Contato(req.body);
    await contatoModel.register();

    if (contatoModel.errors.length > 0) {
        req.flash('errors', contatoModel.errors);
        req.session.save(() => res.redirect('../contato'));
        return;
    }

    req.flash('success', 'Contato cadastrado na sua Agenda');
    req.session.save(() => res.redirect(`../contato/${contatoModel.contato._id}`));
    return;
}

exports.editIndex = async (req, res) => {
    if (!req.params.id) return res.render('404');
    const contato = await Contato.getById(req.params.id);
    if (!contato) return res.render('404');
    
    return res.render('cadastrar-contato', { contato });
}

exports.editContato = async (req, res) => {
    if (!req.params.id) return res.render('404');
    const contatoModel = new Contato(req.body);
    await contatoModel.edit(req.params.id);

    if (contatoModel.errors.length > 0) {
        req.flash('errors', contatoModel.errors);
        req.session.save(() => res.redirect('../contato'));
        return;
    }

    req.flash('success', 'Contato atualizado');
    req.session.save(() => res.redirect(`../${contatoModel.contato._id}`));
    return;
}

exports.deleteContato = async (req, res) => {
    if (!req.params.id) return res.render('404');
    const contato = await Contato.getById(req.params.id);
    if (!contato) return res.render('404');

    await Contato.delete(req.params.id);
    
    req.flash('success', 'Contato removido');
    req.session.save(() => res.redirect('back'));
    return;
}
