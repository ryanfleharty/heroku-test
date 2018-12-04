const mongoose = require('mongoose');
const {Schema} = mongoose;
const findOrCreate = require('mongoose-findorcreate');

const FriendRequestSchema = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    requested: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    accepted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
FriendRequestSchema.plugin(findOrCreate, {upsert: true});
module.exports = mongoose.model("FriendRequest", FriendRequestSchema);