const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Real-time updates

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://exclusiveabhi:maCdjaRpoWvGczS5@cluster0.vjj5b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(express.json());

// Sample location schema
const LocationSchema = new mongoose.Schema({
    userId: String,
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model('Location', LocationSchema);

// Routes
app.post('/location', async (req, res) => {
    const { userId, latitude, longitude } = req.body;

    const newLocation = new Location({
        userId,
        latitude,
        longitude,
    });

    await newLocation.save();
    io.emit('locationUpdate', newLocation); // Emit real-time updates to the portal

    res.status(200).json({ success: true });
});

// Real-time updates via Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
