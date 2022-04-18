const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Users');
const User = mongoose.model('users');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('user/register');
})
router.post('/register',(req,res)=>{
    let errors = [];
    if(req.body.password.length <= 6){
        errors.push({text:"Password is too short"});
    }
    if(req.body.password != req.body.password2){
        errors.push({text:"Passwords don't match"});
    }
    if(errors.length > 0){
        res.render('user/register',{errors:errors})
    }else{
        User.findOne({email:req.body.email}).then((user)=>{
            if(user){
                req.flash('error_msg','this email is already being used ');
                res.redirect('/users/register');
            }else{
                const newUser = new User({
                    username:req.body.username,
                    email:req.body.email,
                    password: req.body.password,
                    isAdmin:1
                })

                bcrypt.genSalt(10,(error,salt)=>{
                    bcrypt.hash(newUser.password,salt,(error,hash) =>{
                        if(error){
                            req.flash('error_msg','An error ocurred crypting the password');
                            res.redirect('/');
                        }
                        newUser.password = hash;
                        
                        newUser.save().then(()=>{
                            req.flash('success_msg','User created successfully');
                            res.redirect('/');
                        }).catch((error)=>{
                            req.flash('error_msg','An error ocurred creating a new user');
                            res.redirect('/users/register');
                        })
                    })
                })
            }
        }).catch((error)=>{
            req.flash('error_msg','an error ocurred' + error);
            res.redirect('/users/register');
        })
    }


})

router.get('/login',(req,res)=>{
    res.render('user/login');
})

router.post('/login',(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true

    })(req,res,next)

    
})
router.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success_msg','Logout successfully');
    res.redirect('/')
})


module.exports = router;