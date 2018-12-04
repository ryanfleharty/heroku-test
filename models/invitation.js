const mongoose = require('mongoose');
const {Schema} = mongoose;
const findOrCreate = require('mongoose-findorcreate');

const InvitationSchema = new Schema({
    plan: {
        type: Schema.Types.ObjectId,
        ref: "Plan"
    },
    inviter: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    invitee: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    accepted: Boolean,
    declined: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
InvitationSchema.plugin(findOrCreate, {upsert: true});
module.exports = mongoose.model("Invitation", InvitationSchema);