const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const orderSchema = new mongoose.Schema({
    products : {
        type : Array,
        required : true
    },
    orderDate:{
        type:String,
        required:true
    },
    medical:{
        type:ObjectId,
        ref:'Medical'
    },
    total_bill:{
        type:Number,
        required:true
    },
    paid_bill:{
        type:Number
    },
    pending_bill:{
        type:Number
    }
})

mongoose.model('Order',orderSchema);