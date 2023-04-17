const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})


UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return  next();
    let user;
    try{
        user = await this.constructor.findOne({email: this.email});
        if(user){
            throw new Error('A user with the given email is already registered');
        }
        user = await this.constructor.findOne({username: this.username});
        if(user){
            throw new Error('A user with the given username is already registered');
        }
        this.password = await bcrypt.hash(this.password, 12);
        next();
    }
    catch(e){
        next(e);
    }
    
})

module.exports = mongoose.model('User', UserSchema);