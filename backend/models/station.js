const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//Station Schema
const stationSchema = new Schema({

    Name: { 
        type: String, 
        required: true, 
        trim: true
    },

    Address: { 
        type: String,
        required: true, 
        trim: true
    },

    StationType: {
        type: String,
        required: true, 
        trim: true,
    },

    FuelType: {
        type: [String],
        required: true,
    },

    Services: {
        type: [String],
        required: true, 
    }

});

stationSchema.index({ Name: 'text' });

// Define and export
module.exports = mongoose.model('Station', stationSchema);