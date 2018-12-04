const mongoose = require('mongoose');
const {Schema} = mongoose;
const findOrCreate = require('mongoose-findorcreate');

const StopSchema = new mongoose.Schema({
    location: {type: Schema.Types.ObjectId, ref: 'Location'},
    startTime: Date,
    endTime: Date,
    description: String,
}, {
    timestamps: true
})
StopSchema.plugin(findOrCreate);
const Stop = mongoose.model('Stop', StopSchema)

module.exports = Stop