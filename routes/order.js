const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = mongoose.model('Order')
const Product = mongoose.model('Product')
const Medical = mongoose.model('Medical')
const requireLogin = require('../middleware/requireLogin')

router.post('/placeneworder',requireLogin,(req,res) => {
    const {products, medical} = req.body
    var total_bill = 0;
    products.map((item)=>{
        total_bill += Number(item.total_bill)
        Product.findOne({product_name : item.product_name})
        .then((result)=>{
            var availableQuants = Number(result.quantities) - Number(item.quantities)-Number(item.freequantities)
            var item_bill = (Number(item.quantities)+Number(item.freequantities))*Number(result.amount)/Number(result.quantities)
            var new_total_bill = Number(result.amount) - Number(item_bill)
            new_total_bill = new_total_bill.toFixed(2)
            Product.findOneAndUpdate(
                {product_name : item.product_name},
                {
                    $set:{
                            quantities : availableQuants,
                            amount : Number(new_total_bill)
                        }
                })
                .then(finalresult =>{
                    
                })
        })
        
    })
    let options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    var orderDate = (new Date())
    orderDate = orderDate.toLocaleString('en-GB',options)
    total_bill = total_bill.toFixed(2)
    const order = new Order({
        products,
        orderDate,
        medical,
        total_bill,
        paid_bill:0,
        pending_bill:total_bill
    })

    order.save().then(resultx=>{
        res.json({message:'Order Placed'})
    }).catch(err=>{
        console.log('err' + err + '\n')
        res.status(400).send({error:'Order failed'})
    })
})

router.get('/orders/:medicalId',requireLogin,(req,res)=>{
    Order.find({medical:req.params.medicalId})
    .populate('medical', 'medical_name')
    .then(result=>{
        //console.log(result)
        if(result.length){
            res.json(result)
        }else{
            Medical.find({_id:req.params.medicalId})
            .then(result=>{
                var data = []
                var medical = {}
                medical.medical = result[0]
                data.push(medical)
                res.json(data)
            })
        }
        
    })
})

router.get('/orderdetail/:orderId',requireLogin,(req,res)=>{
    Order.find({_id:req.params.orderId})
    .populate('medical', 'medical_name')
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        res.send(400).json({error:'Error occured'})
    })
})

router.get('/allorderdetail',(req,res)=>{
    Order.find()
    .populate('medical', 'medical_name')
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        res.send(400).json({error:'Error occured'})
    })
})

router.post('/payBill/:orderId',requireLogin,(req,res)=>{
    const {payBill} = req.body
    Order.findOne({_id:req.params.orderId})
    .then(result => {
        var pending_bill = result.pending_bill
        if(payBill>pending_bill){
            return res.send({error:'Amount to be paid should not be greater than pending bill'})
        }else{
            var paid_bill = Number(result.paid_bill) + Number(payBill)
            pending_bill -= payBill;
            Order.findOneAndUpdate(
                            {_id:req.params.orderId},
                            {$set:{
                                    paid_bill:paid_bill,
                                    pending_bill:pending_bill
                                }
                            })
                            .then(updatedResult => {
                                    res.json(updatedResult)
                                })
                                .catch(err => {
                                    console.log(err)
                                })
        }
    })
    .catch(err => {
        console.log(err)
    })
})

router.delete('/deleteorder/:orderId',requireLogin,(req,res)=>{
    Order.findOneAndDelete({_id:req.params.orderId})
    .then(result=>{
        res.json({message:'Order deleted'})
    })
})

module.exports = router;