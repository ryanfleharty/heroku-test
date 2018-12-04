const MapsQuery = require('../models/maps_query');
const Location = require('../models/location');

module.exports = async (req, res, next)=>{
    const existingQuery = await MapsQuery.findOne({
        "query": req.query.query,
        "location": req.query.city
    })
    if(existingQuery){
        const locations = await Location.find({
            "address": new RegExp(req.query.city, 'i'),
            "keywords": new RegExp(req.query.query, 'i')
        })
        return res.json({
            status: 200,
            data: {
                locations: locations
            }
        })
    } else {
        //continue on to make the api call to google
        next()
    }
}