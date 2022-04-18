const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/Users');
const User = mongoose.model('users');

module.exports = function(passport){

    passport.use(new localStrategy({usernameField:'email'},(email,password,done)=>{
        User.findOne({email:email}).then((user)=>{
            // if (error) { return done(error); }
            if(!user){
                return done(null,false,{message:'Account doesn`t exist'});
            }

            bcrypt.compare(password,user.password,(error,match)=>{
                if(match){
                    return done(null,user,{message:'correct password'});
                }else{
                    return done(null,false,{message:'Invalid password'});
                }
            })
        }).catch((error)=>{
            console.log(error)
        })
    }))

    passport.serializeUser((user,done)=>{
        done(null, user.id);
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id, (err,user)=>{
            done(err,user);
        })
    })
}