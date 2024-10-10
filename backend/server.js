const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BusLocation = require('./models/BusLocation'); // Import the BusLocation model

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://exclusiveabhi:maCdjaRpoWvGczS5@cluster0.vjj5b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// User Schema
const userSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// API to register user
app.post('/register', async (req, res) => {
  const { busNumber, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ busNumber, password: hashedPassword });
    await user.save();
    res.send('User registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

// API to login user
app.post('/login', async (req, res) => {
  const { busNumber, password } = req.body;
  try {
    const user = await User.findOne({ busNumber });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ bus: user.busNumber }, 'secret_key');
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Error logging in user');
  }
});

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token.split(' ')[1], 'secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid token');
      } else {
        console.log('Decoded token:', decoded); // Log the decoded token
        req.busNumber = decoded.bus; // Ensure this matches the token payload
        console.log('Bus number set to:', req.busNumber); // Log the bus number
        next();
      }
    });
  } else {
    res.status(401).send('No token provided');
  }
};
app.post('/update-location', authenticate, async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    // Check if a location entry already exists for the bus number
    let busLocation = await BusLocation.findOne({ busNumber: req.busNumber });

    if (busLocation) {
      // Update existing location
      busLocation.latitude = latitude;
      busLocation.longitude = longitude;
      await busLocation.save();
      res.send('Location updated');
    } else {
      // Create new location
      busLocation = new BusLocation({ busNumber: req.busNumber, latitude, longitude });
      await busLocation.save();
      res.json({ message: 'Location created', locationId: busLocation._id });
    }
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).send('Error updating location');
  }
});

// API to get bus location by bus number
app.get('/bus-location/:busNumber', async (req, res) => {
  const { busNumber } = req.params;
  const busLocation = await BusLocation.findOne({ busNumber }).sort({ timestamp: -1 });
  res.json(busLocation);
});

app.listen(port, () => {
  console.log(`Server running at http://192.168.75.51:${port}`);
});