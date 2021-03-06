const express = require('express')
const app = express()
const morgan = require('morgan')
const productRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect("mongodb+srv://ADMIN:"+process.env.DB_PASSWORD+"@main-db.butdh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true } )



app.use(morgan('dev')) //loging information
app.use('/uploads',express.static('uploads'))
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use('/products', productRoutes)
app.use('/orders',ordersRoutes)
app.use('/users', userRoutes)

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return response.status(200).json({})
    }
    next()
})

app.use((req,res,next)=>{
    const error = new Error('NOT FOUND')
    error.status = 404
    next(error)
})
app.use((error, req,res,next)=>{
    res.json({ 
        error: {
            message: error.message,
            error_status: error.status
        }
    })
})

module.exports = app