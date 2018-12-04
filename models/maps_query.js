const mongoose = require('mongoose');
const {Schema} = mongoose;

const MapsQuerySchema = mongoose.Schema({
    query: String,
    location: String,
    time: Date
}, {
    timestamps: true
})

module.exports = mongoose.model('MapsQuery', MapsQuerySchema);