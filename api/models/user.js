const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: 'String', required: true},
    email: { type: 'String', required: true, unique: true, match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
    password: { type: 'String', required: true},
    group: { type: 'String', required: false, default: 'user'},
    bio: { type: 'String', required: false, default: ' '},
    profilePicture: { type: 'String', required: false, default: ' '}
})
module.exports = mongoose.model('User', userSchema)