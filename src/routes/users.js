const express = require('express');
const router = express.Router();

const User = require('../models/user');
const passport = require('passport');

router.route('/register')
    .get((req, res) => {
        res.render('users/register');
    })
    .post(async (req, res) => {
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

    })

router.route('/login')
    .get((req, res) => {
        res.render('users/login');
    })
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        req.flash('success', 'Welcome back!')
        res.redirect(`${redirectUrl}`);
    })


router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) return next(err)
        req.flash('success', 'Successfully logged out');
        res.redirect('/campgrounds');
    });
})

module.exports = router;