const mongoose = require('mongoose');
const schema = mongoose.Schema;

const category = new schema({
    name:String,
    slug:String,
    date: {
        type: Date,
        default: Date.now
      }
})

mongoose.model("categories",category);