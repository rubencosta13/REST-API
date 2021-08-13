const mongoose = require('mongoose')
const groupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    groupname: {type: String, required: true},
    groupowner: {type: String, required: true},
    groupmembers: {type: String, required:true}
})
module.exports = mongoose.model('Groups', groupSchema)