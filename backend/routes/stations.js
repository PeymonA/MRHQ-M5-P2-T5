var express = require('express');
const stationModel = require("../models/station");
var router = express.Router();

async function stationsToJson(stations) {
  let stationsReturn = [];
  for (let station of stations) {
    const newStation = await stationModel.findOne({title: station.title });
    if (newStation) {
      let returnHours;
      if (typeof newStation.hours === 'string') {
        returnHours = newStation.hours;
      }
      else {
        returnHours = { hours: {
          Monday: newStation.hours[0]?.time || "N/A",
          Tuesday: newStation.hours[1]?.time || "N/A",
          Wednesday: newStation.hours[2]?.time || "N/A",
          Thursday: newStation.hours[3]?.time || "N/A",
          Friday: newStation.hours[4]?.time || "N/A",
          Saturday: newStation.hours[5]?.time || "N/A",
          Sunday: newStation.hours[6]?.time || "N/A",
        }};
      }
      const stationJson = {
        _id: newStation._id,
        title: newStation.title,
        address: newStation.address,
        hours: returnHours,
        services: newStation.services
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
  const stations = await stationModel.find({ services: { $all: services } });
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