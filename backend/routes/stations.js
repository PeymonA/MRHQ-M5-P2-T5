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

module.exports = router;