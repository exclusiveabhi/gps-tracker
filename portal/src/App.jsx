import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import axios from 'axios';
import './App.css';

const App = () => {
  const [busNumber, setBusNumber] = useState('');
  const [map, setMap] = useState(null);

  const fetchBusLocation = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/bus-location/${busNumber}`);
      const { latitude, longitude } = response.data;
      L.marker([latitude, longitude]).addTo(map).bindPopup('Bus Location').openPopup();
      map.setView([latitude, longitude], 13);
    } catch (error) {
      console.error('Error fetching bus location:', error);
    }
  };

  useEffect(() => {
    const mapInstance = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);
  }, []);

  return (
    <div>
      <input
        type="text"
        value={busNumber}
        onChange={(e) => setBusNumber(e.target.value)}
        placeholder="Enter Bus Number"
      />
      <button onClick={fetchBusLocation}>Track Bus</button>
      <div id="map"></div>
    </div>
  );
};

export default App;