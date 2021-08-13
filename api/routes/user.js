const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const user = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/signup', (req, res, next) =>{
    user.find({email: req.body.email}).exec().then(user => {
        if(user.length >= 1){
            return res.status(409).json({message: 'Email already in use'})
        }else{
            bcrypt.hash(req.body.passowrd, 10, (err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    })
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
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
        }
    })
})

router.post('/login', (req, res,next) => {
    user.find({email: req.body.email})
    .exec()
    .then(users => {
        if(user.length < 1){
            return res.send(401).json({
                message: 'Authentication failed. Please try again'
            })
        }
        bcrypt.compare(req.body.password, user[0].passowrd, (err, result) => {
            if(err){
                return res.send(401).json({
                    message: 'Authentication failed. Please try again'
                })
            }
            if(result){
                const token = jwt.sign({email: user[0].email, userId: user[0]._id}, process.env.JWT_KEY, 
                    {
                        
                    },
                )
                return res.status(200).json({
                    message: 'Authentication successful'
                })
            }
            res.send(401).json({
                message: 'Authentication failed. Please try again',
                token: token
            })
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.delete('/:userId', (req, res, next)=> {
    user.remove({_id: req.params.userId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'User deleted successfully'
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({error: err})
    })
})
module.exports = router