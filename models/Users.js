const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    username:String,
    email:String,
    password:String,
    isAdmin:{
        type:Number,
        default:0
    }
})

mongoose.model('users',user);