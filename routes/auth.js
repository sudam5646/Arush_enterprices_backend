const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/key');

router.post('/signup', (req,res) =>{
    var {email,password} = req.body
    email = email.trim()
    password = password.trim()
    console.log("email",email)
    console.log("password",password)

    if(!email || !password){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser => {
        if(savedUser){
            return res.status(422).send({error:"user already exist"})
        }
        else{
            bcrypt.hash(password,12)
            .then(hashedpassword =>{
                const user = new User({
                    email,
                    password:hashedpassword
                })
                user.save()
                .then(user => {
                    res.json({message :"saved successfully"})
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err =>{
                console.log(err)
            })
            
        }
    })).catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req,res) =>{
    var {email,password} = req.body;
    email = email.toUpperCase().trim()
    password = password.trim()
    if(!email || !password){
        res.status(400).send({error:"please add email and password both"})
    }
    else{
        try{
            User.findOne({email:email})
        .then(savedUser =>{
            if(!savedUser){
                return res.status(400).send({error:"Email is not registered"})
            }
            bcrypt.compare(password,savedUser.password)
            .then(doMath =>{
                if(doMath){
                    //res.send({message:"Signed in successfully"});
                    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    const {_id,email} = savedUser
                    res.json({token,user:{_id,email}});
                }else{
                    return res.status(400).send({error:"invalid email or password"})
                }
            })
        })
        }catch(err){
            return res.status(400).send({error:err})
        }
        
    }
})

module.exports = router