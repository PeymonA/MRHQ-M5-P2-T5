var express = require('express');
const stationModel = require("../models/station");
var router = express.Router();

router.get("/", async (request, response) => {
  const stations = await stationModel.find({});
  try {
    response.send(stations);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/filter", async (request, response) => {
  const {services, stationType, fuelType} = request.body;
  const stations = await stationModel.find({ services: { $all: services } });
  try {
    response.send(stations);
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