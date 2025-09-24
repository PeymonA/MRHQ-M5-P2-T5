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

      const returnFuelTypes = newStation.fuelTypesArray.map(fuelType => ({
        fuel: fuelType.fuel,
        price: fuelType.price
      }));

      const stationJson = {
        _id: newStation._id,
        title: newStation.title,
        address: newStation.address,
        hours: returnHours,
        phone: newStation.phone,
        services: newStation.services,
        fuelTypes: returnFuelTypes,
        fuelTypesSearch: newStation.fuelTypesArray,
        avgPrice: newStation.avgPrice
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
  try {
    const { services, fuelType, sortBy } = request.body;

    // Build query object dynamically
    const query = {};

    let stations;
    
    if ((sortBy && sortBy !== 'no sort') && (fuelType && fuelType !== 'no fuel')) {
      // Add services filter if provided and not empty
      if (services && Array.isArray(services) && services.length > 0) {
        query.services = { $all: services };
      }
      
      // Add fuel type filter if provided and not 'no fuel'
      const fuelTypes = Array.isArray(fuelType) ? fuelType : [fuelType];
      query['fuelTypesArray.fuel'] = { $in: fuelTypes };
      
      const sortField = `fuelTypesJson.${fuelType}`;
      
      if (sortBy === 'Low to High') {
        stations = await stationModel.find(query).sort({ [sortField]: 1 });        
      }
      else {
        stations = await stationModel.find(query).sort({ [sortField]: -1 });
      }
    }
    else {
      // Add services filter if provided and not empty
      if (services && Array.isArray(services) && services.length > 0) {
        query.services = { $all: services };
      }
      
      // Add fuel type filter if provided and not 'no fuel'
      if (fuelType && fuelType !== 'no fuel') {
        // Handle both single fuel type and array of fuel types
        const fuelTypes = Array.isArray(fuelType) ? fuelType : [fuelType];
        query['fuelTypesArray.fuel'] = { $in: fuelTypes };
      }

      if (sortBy && sortBy !== 'no sort') {
        if (sortBy === 'Low to High') {
          stations = await stationModel.find(query).sort({ avgPrice: 1 });
        }
        else {
          stations = await stationModel.find(query).sort({ avgPrice: -1 });
        }
      }
      else {
        stations = await stationModel.find(query);
      }
    }

    let stationsReturn = await stationsToJson(stations);
    
    response.send(stationsReturn);
  } catch (error) {
    console.error('Error filtering stations:', error);
    response.status(500).send({ error: 'Failed to filter stations' });
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