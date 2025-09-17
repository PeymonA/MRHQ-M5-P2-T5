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
        trim: true
    },

    OpeningHours: {
        type: String,
        trim: true,
    },

    Services: {
        type: [String]
    }
});

stationSchema.index({ Name: 'text' });

// Define and export
module.exports = mongoose.model('Station', stationSchema);