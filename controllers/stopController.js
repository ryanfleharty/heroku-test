const express = require('express');
const router = express.Router();
const Plan = require('../models/plan');
const Stop = require('../models/stop');
const maps = require('../maps');
const requireLogin = require('../middleware/requireLogin');
const checkCachedMapsQuery = require('../middleware/checkCachedMapsQuery')

router.post('/', requireLogin, async (req, res)=>{
    console.log("^^^ MAKING A STOP RIGHT HERE ^^^")
    console.log(req.body);
    try {
        const data = {
            "location": req.body.location,
            "description": req.body.description,
            "startTime": Date.parse(req.body.startTime),
        }
        let stop = await Stop.create(data)
        stop = await Stop.findById(stop._id).populate('location');
        const current_plan = await Plan.findById(req.planId);
        current_plan.stops.push(stop.id);
        await current_plan.save();
        console.log(stop);
        res.json({
            status: 200,
            data: stop
        })
    }
    catch (err) {
        console.log(err);
        res.redirect(`/plans/${req.planId}`)
    }
    
})
router.get('/new', async (req, res)=>{
    const plan = await Plan.findById(req.planId);
    res.render('stops/new.ejs', {
        plan: plan
    });
})
router.get('/search', checkCachedMapsQuery, maps.searchPlaces);

module.exports = router;