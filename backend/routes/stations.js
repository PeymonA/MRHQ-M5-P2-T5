var express = require('express');
const stationModel = require("../models/station");
var router = express.Router();

function getRandomFloat(min, max, decimals = 2) {
  min = min * 100;
  max = max * 100;
  const randomFloat = Math.random() * (max - min) + min;
  return (Math.round(randomFloat * Math.pow(10, decimals)) / Math.pow(10, decimals));
}

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

      const returnFuelTypes = newStation.fuelTypes.map(fuelType => ({
        fuel: fuelType,
        price: getRandomFloat(2.5, 3.5)
      }));

      const stationJson = {
        _id: newStation._id,
        title: newStation.title,
        address: newStation.address,
        hours: returnHours,
        phone: newStation.phone,
        services: newStation.services,
        fuelTypes: returnFuelTypes,
        fuelTypesSearch: newStation.fuelTypes
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
  const {services, fuelType} = request.body;
  let stations;
  if (fuelType === 'no fuel' ) {
    stations = await stationModel.find({ services: { $all: services } });
  }
  else if (!services) {
    stations = await stationModel.find({ fuelTypes: { $in: fuelType } });
  }
  else {
    stations = await stationModel.find({ services: { $all: services }, fuelTypes: { $in: fuelType } });
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