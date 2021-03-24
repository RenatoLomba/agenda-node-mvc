const UserModel = require('../models/UserModel');

exports.index = (req, res) => {
    if (req.session.user) return res.redirect('/');
    return res.render('login');
}

exports.signin = async (req, res) => {
    const userModel = new UserModel(req.body);
    await userModel.login();

    if (userModel.errors.length > 0) {
        req.flash('errors', userModel.errors);
        req.session.save(() => res.redirect('../login'));
        return;
    }

    req.flash('success', 'Usuário logado');
    req.session.user = userModel.user;
    req.session.save(() => res.redirect('/'));
    return;
}

exports.signup = async (req, res) => {
    const userModel = new UserModel(req.body);
    await userModel.register();
    if (userModel.errors.length > 0) {
        req.flash('errors', userModel.errors);
        req.session.save(() => res.redirect('../login'));
        return;
    }

    req.flash('success', 'Usuário criado com sucesso');
    req.session.save(() => res.redirect('../login'));
    return;
}

exports.signout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
    return;
}
