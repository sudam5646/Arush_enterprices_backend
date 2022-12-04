const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Medical = mongoose.model('Medical')
const requireLogin = require('../middleware/requireLogin')

router.get('/allmedicals',requireLogin,(req,res)=>{
    Medical.find()
    .sort('-createdAt')
    .then(medicals=>{
        res.json(medicals)
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/medicaldetail/:medicalId',requireLogin,(req,res)=>{
    Medical.findOne({_id:req.params.medicalId})
    .then(medical=>{
        res.json(medical)
    }).catch(err=>{
        console.log(err)
    })
})


router.post('/addmedical',requireLogin, (req,res) =>{
    if(!req.body){
        return res.status(400).json({error:"req body is empty"})
    }
    if(!req.body.medical_name ||!req.body.contact ||!req.body.address){
        return res.status(400).json({error:"please add all the fields"})
    }
    
    const {medical_name,contact,address} = req.body
    Medical.findOne({medical_name:medical_name})
    .then(medical =>{
        if(medical){
            return res.status(422).send({error:"Medical already exist in records"})
        }else{
            const medical = new Medical({
                medical_name,
                contact,
                address
            })
            medical.save().then(result =>{
                res.json({medical:result})
            }).catch(err =>{
                console.log(err)
            })
        }
    })
    
})

router.post('/searchbymedicalname',requireLogin,(req,res)=>{
    var medicalname = req.body.medicalname
    medicalname = medicalname.toString()
    Medical.find({
        $or:[
            {medical_name:{$regex:medicalname,$options:'$i'}},
            {address:{$regex:medicalname,$options:'$i'}}
        ]
    })
    .sort('-createdAt')
    .then(medicals=>{
        res.json(medicals)
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;

