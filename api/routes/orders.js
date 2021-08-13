const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Order = require('../models/orders')

router.get('/',(req, res) => {
    Order.find()
    .select('_id quantity product')
    .populate('product', 'name _id')
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            orders: docs.map(docs => {
                return {
                    product: docs.product,
                    quantity: docs.quantity,
                    _id: docs._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/orders/'+docs._id
                    }
                }
            })  
        }
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({ error: err })
    })
})

router.post('/',(req, res) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    })
    order
    .save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            //result
            message: 'Order successfully placed',
            body: {
                orderId: result._id,
                productId: result.product,
                quantity: result.quantity
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    })
})
router.get('/:orderId',(req, res) => {
    const Id = req.params.orderId
    Order.findById(Id)
    .select('_id product quantity')
    .populate('product', '_id product price')
    .exec()
    .then(order =>{
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3001/orders/' +order._id
            }
        })
    })
    .catch(err => {
        res.status(500).json({ error: err})
    })
})
router.delete('/:orderId',(req, res) => {
    const Id = req.params.id
    Order.deleteOne({_id: Id})
    .exec()
    .then(doc =>{ 
        res.status(200).json({
            message: 'Order deleted successfully',
            CreatedOrder: {
                product: doc.product,
                quantity: doc.quantity,
                _id: doc._id,
                request: {
                    description: 'To add a new order use the following details:',
                    type: 'POST',
                    url: 'http://localhost:3001/oders/',
                    body: {name: 'String', quantity: 'Number'}
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })    
    })
})
module.exports = router