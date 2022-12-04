const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required : true
    },
    quantities:{
        type:Number,
        required : true
    },
    amount:{
        type:Number,
        required : true
    }
},{timestamps:true})

mongoose.model("Product",productSchema);