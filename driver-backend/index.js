const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const Driver = require('./models/Driver');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Driver Signup/Login route
app.post('/api/signup', async (req, res) => {
  const { name, busNumber, password } = req.body;
  try {
    // Check if the driver already exists based on the name
    let driver = await Driver.findOne({ name });
    if (!driver) {
      // If driver doesn't exist, create a new one
      driver = new Driver({ name, startingLocation, destinationLocation, password });
      await driver.save();
    }
    res.json({ driverId: savedDriver._id }); y
  } catch (err) {
    res.status(500).json({ error: 'Failed to sign up or login' });
  }
});

// Location update route
app.post('/api/send-location', async (req, res) => {
  const { driverId, latitude, longitude } = req.body;
  try {
    const driver = await Driver.findById(driverId);
    if (driver) {
      driver.location = { latitude, longitude };
      await driver.save();
      res.json({ message: 'Location updated' });
    } else {
      res.status(404).json({ error: 'Driver not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update location' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
