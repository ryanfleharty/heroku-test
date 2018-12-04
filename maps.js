const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAPS_API_KEY
});
const Location = require('./models/location');
const MapsQuery = require('./models/maps_query');
module.exports = {
    async searchPlaces(req, res, next){
            await MapsQuery.create({
                "query": req.query.query,
                "location": req.query.location
            })
            //getLocation takes in the query and returns a google latitude and longitude object
            getLocation(req.query.location, function(locationResponse){
                //locationResponse is the {lat: x, lng: y} object
                getPlaces(req.query.query, locationResponse.lat, locationResponse.lng, async function(response){
                    let places = response.sort((place1, place2)=>{
                        return place2.rating - place1.rating;
                    })
                    places = places.map(async(place)=>{
                        try{
                            const result = await Location.findOrCreate({
                                "googleId": place.id },
                                {
                                "latitude": place.geometry.location.lat,
                                "longitude": place.geometry.location.lng,
                                "name": place.name,
                                "googleId": place.id,
                                "address": place.formatted_address,
                                "keywords": [req.query.query]
                            });
                            result.doc.keywords.addToSet(req.query.query);
                            await result.doc.save()
                            return result.doc;
                        } catch(err) {
                           next(err);
                        }
                    })
                    Promise.all(places).then(async function(locations){
                        return res.json({
                            status: 200,
                            data: {
                                "locations": locations
                            }
                        })
                    })
                    
                })
            })
    },
    getPlace(req, res, next){
        googleMapsClient.place({"placeid":req.params.id}, function(err, response){
            if(err){
                next(err)
            }
            res.json({
                "place":response.json.result
            })
        })
    }
}
function getPlaces(query, lat, lng, callback){
    googleMapsClient.places({
            "query":query,
            "location":`${lat},${lng}`,
            "radius":25
    }, function(err, response){
        if(!err){
            callback(response.json.results)
        }
        else{
            console.log(err)
        }
    })
}
function getLocation(city, callback){
    googleMapsClient.geocode({address: city},
        function(err, response){
            if(!err){
                callback(response.json.results[0].geometry.location);
            } else {
                console.log("PROBLEM CHIEF")
            }
        }
    )
}
