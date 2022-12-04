const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const requireLogin = require('../middleware/requireLogin')

router.get('/allproducts',(req,res)=>{
    Product.find()
    .sort('-createdAt')
    .then(products=>{
        res.json(products)
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/productById/:productId',requireLogin,(req,res)=>{
    Product.findById({_id:req.params.productId})
    .then(product=>{
        res.json(product)
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/addproduct',requireLogin, (req,res) =>{
    if(!req.body){
        return res.status(400).json({error:"req body is empty"})
    }
    if(!req.body.product_name ||!req.body.quantities ||!req.body.amount){
        return res.status(400).json({error:"please add all the fields"})
    }
    
    const {product_name,quantities,amount} = req.body
    Product.findOne({product_name:product_name})
    .then(product =>{
        if(product){
            return res.status(422).send({error:"Product already exist"})
        }else{
            const product = new Product({
                product_name,
                quantities,
                amount
            })
            product.save().then(result =>{
                res.json({product:result})
            }).catch(err =>{
                console.log(err)
            })
        }
    })
    
})

router.put('/updateproduct/:productId',requireLogin, (req,res) =>{
    const {product_name,quantities,amount} = req.body
    Product.updateOne(
        {_id:req.params.productId},
        {$set:{
                product_name:product_name,
                quantities:quantities,
                amount:amount
            }
        })
        .then(product=>{
            res.json(product)
        }).catch(err=>{
            console.log(err)
        })
})

router.delete('/deleteproduct/:productId',requireLogin,(req,res)=>{
    Product.findOneAndDelete({_id:req.params.productId})
    .then(result=>{
        res.json({message:'Product deleted'})
    })
})

router.post('/searchbytitle',requireLogin,(req,res)=>{
    var productname = req.body.productname
    productname = productname.toString()
    Product.find({
        $or:[
            {product_name:{$regex:productname,$options:'$i'}}
        ]
    })
    .sort('-createdAt')
    .then(products=>{
        res.json(products)
    }).catch(err=>{
        console.log(err)
    })
})
module.exports = router;