const mongoose = require('mongoose');
const {Schema} = mongoose;

const PlanSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: Date,
    description: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User'},
    joiners: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    decliners: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    invitedUsers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    stops: [{ type: Schema.Types.ObjectId, ref: 'Stop'}]
}, {
    timestamps: true
})

const Plan = mongoose.model('Plan', PlanSchema);
module.exports = Plan;