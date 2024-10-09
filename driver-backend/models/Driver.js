const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startingLocation: { type: String, required: true },
  destinationLocation: { type: String, required: true },
  password: { type: String, required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
});

module.exports = mongoose.model('Driver', DriverSchema);
