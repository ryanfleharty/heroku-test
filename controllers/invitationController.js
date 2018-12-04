const router = require('express').Router();
const Invitation = require("../models/invitation");
const User = require('../models/user');
const Plan = require('../models/plan');

router.post('/', async (req, res, next)=>{
    try{
        const user = await User.findById(req.body.userId);
        const plan = await Plan.findById(req.body.planId);
        const invitation = await Invitation.findOrCreate({
            "inviter": req.user._id,
            "invitee": user.id,
            "plan": plan._id
        });
        plan.invitedUsers.addToSet(user.id);
        await plan.save();
        //SPREAD OPERATOR SCREWS UP _DOC, UNPACK MANUALLY
        const responseInvitation = {
            _id: invitation.doc._id,
            inviter: req.user,
            invitee: user,
            plan: plan,
            accepted: invitation.doc.accepted,
            rejected: invitation.doc.rejected,
            createdAt: invitation.doc.createdAt,
            updatedAt: invitation.doc.updatedAt
        }
        res.json({
            status: 200,
            data: {
                invitation: responseInvitation
            }
        })
    } catch(err){
        return next(err);
    }
})

router.post('/:id/accept', async(req, res, next)=>{
    try{
        console.log("ACCEPTING AN INVITATION");
        const invitation = await Invitation.findById(req.params.id).populate('plan')
        invitation.plan.joiners.addToSet(req.user._id)
        await invitation.plan.save()
        invitation.accepted = true;
        invitation.declined = false;
        await invitation.save()
        res.json({
            status:200,
            data: invitation
        })
    } catch(err) {
        next(err);
    }
})
router.post('/:id/decline', async(req, res, next)=>{
    try{
        console.log("REJECTING AN INVITATION");
        const invitation = await Invitation.findById(req.params.id).populate('plan')
        invitation.plan.decliners.addToSet(req.user._id)
        await invitation.plan.save()
        invitation.accepted = false;
        invitation.declined = true;
        await invitation.save()
        res.json({
            status:200,
            data: invitation
        })
    } catch(err) {
        next(err);
    }
})

module.exports = router;