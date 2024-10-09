import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [busLocation, setBusLocation] = useState(null);
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');

  const fetchBusLocation = async () => {
    try {
      const response = await axios.get('http://your-backend-url/api/get-bus-location');
      setBusLocation(response.data.location);
    } catch (error) {
      console.error('Error fetching bus location');
    }
  };

  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition(position => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    });

    // Fetch bus location every 4 seconds
    const intervalId = setInterval(() => {
      fetchBusLocation();
    }, 4000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div>
      <input
        placeholder="Starting Location"
        value={startingPoint}
        onChange={(e) => setStartingPoint(e.target.value)}
      />
      <input
        placeholder="Destination Location"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <MapContainer center={userLocation || [51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && <Marker position={userLocation}></Marker>}
        {busLocation && <Marker position={busLocation}></Marker>}
        {userLocation && busLocation && (
          <Polyline positions={[userLocation, busLocation]} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default App;
