
const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username, password });
        await user.save();
        req.logIn(user, (err) => {
            if (err) return done(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!')
    res.redirect('/campgrounds');

}

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) return next(err)
        req.flash('success', 'Successfully logged out');
        res.redirect('/campgrounds');
    });
}