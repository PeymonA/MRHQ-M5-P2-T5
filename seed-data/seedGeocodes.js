const fs = require('fs');
const mongoose = require('mongoose');

// Map global promise
mongoose.Promise = global.Promise;
// Connect to db
const db = mongoose.connect('mongodb://localhost:27017/m5');

const Geocode = require('./models/geocode');

// Seed db
const seed = async () => {
  try {
    await Geocode.deleteMany({});

    fs.readFileSync('stations.json', 'utf-8');
    const geocodes = JSON.parse(fs.readFileSync('pins.json', 'utf-8'));
    for (const geocode of geocodes) {
        const key = geocode.key;
        const location = {
            lat: geocode.location.lat,
            lng: geocode.location.lng
        };
        await Geocode.create({ key, location });
    }
    
    console.info("DB Seeded");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seed();