
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');
const User = require('../models/user');

passport.use(new LocalStrategy(async(username, password, done)=>{
    try{
        const user = await User.findOne({username});
        if(!user) return done(null, false, {message: "Username or password is incorrect"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return done(null, false, {message: "Username or password is incorrect"});
        }
        done(null, user);
    }
    catch(e){
        done(e);
    }
}))

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser(async(id, done)=>{
    try{
        const user = await User.findById(id);
        done(null, user);
    }
    catch(e){
        done(e)
    }
})

module.exports = passport