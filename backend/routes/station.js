var express = require('express');
const stationModel = require("../models/station");
var router = express.Router();

router.post("/", async (request, response) => {
  const station = new stationModel(request.body);
  try {
    await station.save();
    response.send(station);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;