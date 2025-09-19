var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get("/", async (request, response) => {
  const geocodes = JSON.parse(fs.readFileSync('./pins.json', 'utf-8'));
  try {
    response.send(geocodes);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;