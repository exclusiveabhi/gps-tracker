import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const FetchBusLocation = ({ busNumber }) => {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/bus-location/${busNumber}`);
        const { latitude, longitude } = response.data;
        setPosition([latitude, longitude]);
        map.setView([latitude, longitude], 17);
      } catch (error) {
        console.error('Error fetching bus location:', error);
      }
    };

    if (busNumber) {
      fetchBusLocation();
    }
  }, [busNumber, map]);

  return position ? (
    <Marker position={position}>
      <Popup>Bus Location</Popup>
    </Marker>
  ) : null;
};

function App() {
  const [busNumber, setBusNumber] = useState('');

  return (
    <div style={{ height: '100vh' }}>
      <input
        type="text"
        value={busNumber}
        onChange={(e) => setBusNumber(e.target.value)}
        placeholder="Enter Bus Number"
      />
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {busNumber && <FetchBusLocation busNumber={busNumber} />}
      </MapContainer>
    </div>
  );
}

export default App;