const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Geocode Schema
const geocodeSchema = new Schema({
    key: { 
        type: String, 
        required: true, 
    },

    location: { 
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
});

// Define and export
module.exports = mongoose.model('Geocode', geocodeSchema);