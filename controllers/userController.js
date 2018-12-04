const router = require('express').Router();
const User = require('../models/user');
const requireLogin = require('../middleware/requireLogin');
const Invitation = require('../models/invitation');
const Plan = require('../models/plan');
const FriendRequest = require('../models/friendRequest');

router.get('/', async (req, res)=>{
    query = req.query.query || "";
    try{
        const users = await User.find({_id: { $ne: req.user._id },
            username: new RegExp(query, 'i'),
        });
        res.json({
            status: 200,
            data: users
        })
    }catch(err){
        next(err);
    }


})
router.post('/:id/request-friend', async(req, res, next)=>{
    try{
        const newFriendRequest = await FriendRequest.findOrCreate({
            requester: req.user._id,
            requested: req.params.id
        })
        console.log(newFriendRequest);
        if(newFriendRequest.created){
            const newRequest = await FriendRequest.findById(newFriendRequest.doc._id).populate({"path":"requester","select":"-password"}).populate({"path":"requested","select":"-password"})
            res.json({
                status:200,
                data: newRequest
            })
        }else{
            res.json({
                status: 400 //bad request, duplicates
            })
        }

    } catch(err){
        next(err);
    }
})
router.post('/:id/add-friend', async (req, res, next)=>{
    try {
        if(req.params.id !== req.user.id){
            const user = await User.findById(req.params.id).select('-password');
            console.log(req.user);
            req.user.friends.addToSet(user.id);
            await req.user.save();
            user.friends.addToSet(req.user.id);
            await user.save();
            console.log("SUCCESS?")
            const obsoleteRequest = await FriendRequest.findOne({"requester":req.params.id, "requested":req.user._id})
            console.log(obsoleteRequest);
            obsoleteRequest.accepted = true;
            await obsoleteRequest.save()
            res.json({
                status: 200,
                data: {
                    user: user
                }
            })
        }
    } catch (err) {
        next(err);
    }
})
router.get('/friend-requests', async (req, res, next)=>{
    try{
        const friendRequests = await FriendRequest.find({$or:[
            {"requested": req.user._id,"accepted":false},
            {"requester": req.user._id,"accepted": false}]})
        .populate({"path": "requester","select":"-password"})
        .populate({"path": "requested","select":"-password"})
        console.log("GOT FRIEND REQUESTS")
        console.log(friendRequests);
        res.json({
            status: 200,
            data: friendRequests
        })
    } catch(err){
        next(err);
    }
})
router.get('/user-data', async (req, res, next)=>{
    try{
        const user = await User.findById(req.user._id)
                                .populate({
                                    "path": 'friends',
                                    "select": '-password'})
                                .select('-password')
        const invitations = await Invitation.find({"invitee":req.user._id,"accepted":false})
                                            .populate([{path:'plan'},{path:'inviter',select:'-password'}]);
        const plans = await Plan.find({$or: [{"creator": req.user._id},{"joiners": req.user._id}]});
        const userData = {
            "invitations": invitations,
            "plans": plans,
            "user": user
        }
        res.json({
            "status": 200,
            "data": userData
        })
    }catch(err){
        next(err);
    }
})

module.exports = router;