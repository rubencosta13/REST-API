const express = require('express')
const router = express.Router()
const Product = require('../models/products')
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')

router.get('/:groupid', (req, res) =>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc =>{
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/products/' +doc._id 
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch((err) =>{
        res.status(500).json({error: err})
    })
})
router.post('/',checkAuth, upload.single('productImage'), (req, res) =>{
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save().then(result =>{
        console.log(result)
        res.status(201).json({ 
            message: 'PRODUTO ADICIONADO!',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3001/' +result._id
                }
            }
        }) 
    }).catch(err =>{
        console.log(err)
        res.status(500).json({error: err})
    })

    
})
router.get('/:id', (req, res) =>{
    const Id = req.params.id
    Product.findById(Id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        if (doc){
            res.status(200).json({
                createdProduct: {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/' +doc._id,
                        description: 'GETS INFORMATION ABOUT A SPECIFIC PRODUCT'
                    }
                }
            })
        }else{
            res.status(404).json({message: 'ID INVALIDO!'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})
router.patch('/:id', (req, res) =>{
    const Id = req.params.id
    const updateOps = {}
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Product.findOneAndUpdate({_id:Id},{
        $set: updateOps
    }).exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            createdProduct: {
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3001/' +doc._id
                }
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})
router.delete('/:id', (req, res) =>{
    const id = req.params.id
    Product.deleteOne({_id: id})
    .exec()
    .then(doc => {
        res.status(200).json({
            message: "Product deleted successfully",
            createdProduct: {
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3001/products',
                    body: {name: 'String', price: 'Number'}
                }
            }
        })
    })
    .catch((err) =>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router