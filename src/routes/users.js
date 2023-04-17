const express = require('express');
const router = express.Router();

const User = require('../models/user');
// const handleAsync = require('../utils/handleAsync');

router.route('/register')
    .get((req, res) => {
        res.render('users/register');
    })
    .post(async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username, password });
            await user.save();

            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        }   
        catch(e){
            req.flash('error', e.message);
            res.redirect('register');
        }
    
})

module.exports = router;