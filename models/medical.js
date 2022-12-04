const mongoose = require('mongoose');

const medicalSchema = new mongoose.Schema({
    medical_name:{
        type:String,
        required : true
    },
    contact:{
        type:String,
        required : true
    },
    address:{
        type:String,
        required : true
    }
},{timestamps:true})

mongoose.model("Medical",medicalSchema);