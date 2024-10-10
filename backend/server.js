const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      const token = jwt.sign({ busNumber: user.busNumber }, 'secret_key');
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
        req.busNumber = decoded.busNumber;
        next();
      }
    });
  } else {
    res.status(401).send('No token provided');
  }
};

// API to update bus location
app.post('/update-location', authenticate, async (req, res) => {
  const { latitude, longitude } = req.body;
  const busLocation = new BusLocation({ busNumber: req.busNumber, latitude, longitude });
  await busLocation.save();
  res.send('Location updated');
});

// API to get bus location by bus number
app.get('/bus-location/:busNumber', async (req, res) => {
  const { busNumber } = req.params;
  const busLocation = await BusLocation.findOne({ busNumber }).sort({ timestamp: -1 });
  res.json(busLocation);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});