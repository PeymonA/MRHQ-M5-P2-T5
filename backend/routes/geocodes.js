var express = require('express');
const geocodeModel = require("../models/geocode");
var router = express.Router();

router.get("/", async (request, response) => {
  try {
    const geocodes = await geocodeModel.find({});
    
    // Transform the data into the desired format
    const geocodesReturn = geocodes.map(geocode => ({
      key: geocode.key,
      location: {
        lat: geocode.location.lat,
        lng: geocode.location.lng
      }
    }));
    
    response.send(geocodesReturn);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/", async (request, response) => { 
  try {
    const stations = request.body;
    let geocodesReturn = [];
    for (let station of stations) {
      const newGeocode = await geocodeModel.findOne({key: station.title });
      if (newGeocode) {
        const geocodeJson = {
          key: newGeocode.key,
          location: {
            lat: newGeocode.location.lat,
            lng: newGeocode.location.lng
          }
        };
        geocodesReturn.push(geocodeJson);
      }
    }
    response.send(geocodesReturn);
  } catch (error) {
    response.status(500).send(error);
  }
}); 

module.exports = router;