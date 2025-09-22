var express = require('express');
const stationModel = require("../models/station");
var router = express.Router();

async function stationsToJson(stations) {
  let stationsReturn = [];
  for (let station of stations) {
    const newStation = await stationModel.findOne({title: station.title });
    if (newStation) {

      const returnHours = { hours: {
        Monday: newStation.hours[0]?.time || "N/A",
        Tuesday: newStation.hours[1]?.time || "N/A",
        Wednesday: newStation.hours[2]?.time || "N/A",
        Thursday: newStation.hours[3]?.time || "N/A",
        Friday: newStation.hours[4]?.time || "N/A",
        Saturday: newStation.hours[5]?.time || "N/A",
        Sunday: newStation.hours[6]?.time || "N/A",
      }};
      
      const stationJson = {
        _id: newStation._id,
        title: newStation.title,
        address: newStation.address,
        hours: returnHours,
        phone: newStation.phone,
        services: newStation.services,
        fuelTypes: newStation.fuelTypes
      };
      stationsReturn.push(stationJson);
    }
  }
  return stationsReturn;
}

router.get("/", async (request, response) => {
  const stations = await stationModel.find({});

  const stationsReturn = await stationsToJson(stations);

  try {
    response.send(stationsReturn);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/filter", async (request, response) => {
  const {services, stationType, fuelType} = request.body;
  let stations;
  if (fuelType === 'no fuel' ) {
    stations = await stationModel.find({ services: { $all: services } });
  }
  else if (services.length === 0) {
    stations = await stationModel.find({ fuelTypes: { $all: fuelType } });
  }
  else {
    stations = await stationModel.find({ services: { $all: services }, fuelTypes: { $all: fuelType } });
  }
  const stationsReturn = await stationsToJson(stations);
  try {
    response.send(stationsReturn);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.delete("/", async (request, response) => {
  try {
    await stationModel.deleteMany({});
    response.status(200).send();
  }
  catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;