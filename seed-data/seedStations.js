const fs = require('fs');
const mongoose = require('mongoose');

// Map global promise
mongoose.Promise = global.Promise;
// Connect to db
const db = mongoose.connect('mongodb://localhost:27017/m5');

const Station = require('./models/station');

// Seed db
const seed = async () => {
  try {
    await Station.deleteMany({});

    fs.readFileSync('detailedStations.json', 'utf-8');
    const stations = JSON.parse(fs.readFileSync('detailedStations.json', 'utf-8'));
    for (const station of stations) {
        const title = station.name;
        const address = station.address;
        const hours = station.hours;
        const phone = station.phone;
        const services = station.services;
        const fuelTypes = station.fuelTypes;
        await Station.create({ title, address, hours, phone, services, fuelTypes });
    }
    
    console.info("DB Seeded");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seed();