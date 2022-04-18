const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    title : String,
    slug:String,
    description : String,
    content : String,
    category:{
        type: Schema.Types.ObjectId,
        ref:"categories"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

mongoose.model("posts",Post);