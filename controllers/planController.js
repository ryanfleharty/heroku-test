const express = require('express');
const router = express.Router();
const stopController = require('./stopController');
const Plan = require('../models/plan');
const User = require('../models/user');
const Invitation = require('../models/invitation');
const requireLogin = require('../middleware/requireLogin');

router.get('/', async (req, res, next)=>{
    try{
        const plans = await Plan.find({creator: req.user.id});
        const invitedPlans = await Invitation.find({invitee: req.user.id}).populate('plan').populate('inviter');
        res.json({
            status: 200,
            data: {
                plans: plans,
                invitedPlans: invitedPlans
            }
        })
    } catch(err){
        res.json({
            status: 400,
            data: err
        })
        next(err);
    }

})

router.get('/:id', async (req, res)=>{
    try{
        const plan = await Plan.findById(req.params.id)
        .populate({path: 'creator', 
                    select: " -password "})
        .populate({path: 'joiners', 
                    select: " -password "})
        .populate({path: 'invitedUsers',
                    select: " -password "})
        .populate({path: 'stops',
                    populate: { path: 'location'}
        });
        res.json({
            status: 200,
            data: plan
        })
    }catch(err){
        res.json({
            status: 400,
            data: err
        })
    }

})

router.post('/', requireLogin, async (req, res)=>{
    try{
        date = Date.parse(req.body.date);
        const data = {
            "title": req.body.title,
            "date": date,
            "description": req.body.description,
            "creator": req.user.id,
            "joiners": [req.user.id]
        }
        const plan = await Plan.create(data);
        res.json({
            status: 200,
            data: plan
        })
    } catch(err){
        console.log(err)
        res.json({
            status: 400,
            data: err
        })
    }

})


module.exports = router