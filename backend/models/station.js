const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Station Schema
const stationSchema = new Schema({
    title: { 
        type: String, 
        required: true, 
    },

    address: { 
        type: String,
        required: true, 
    },

    hours: {
        type: String,
        required: true,
    },

    services: {
        type: [String],
    }
});

stationSchema.index({ title: 'text' });

// Define and export
module.exports = mongoose.model('Station', stationSchema);