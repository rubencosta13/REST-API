const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const user = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/signup', (req, res, next) =>{
    bcrypt.hash(req.body.passowrd, 10, (err, hash)=>{
        if(err){
            return res.status(500).json({
                error: err
            })
        }else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                passowrd: hash
            })  
            user
            .save()
            .then(result => {res.status(201).json({
                    message: 'User created successfully'
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ error: err 
                })
            })
        }
    })
})
module.exports = router