# Child Safety Tracker 🚍

Child Safety Tracker is a web and mobile application designed to provide real-time tracking for children and buses, similar to features found in "Where Is My Train" apps. It offers live location updates and an intuitive map view, allowing users to effortlessly monitor locations.

## Project Structure 🗂️

- **Frontend (Portal)**: Built using React.js for the web interface (MERN).
- **Backend**: Node.js with Express.js as the server framework, MongoDB for data storage, and real-time updates with Socket.IO for location tracking.
- **Mobile App**: React Native app to track the child’s location using the device’s GPS and send it to the backend in real-time.
- **Location API**: Uses Google Maps API (or similar) for geocoding, reverse geocoding, and routing.
- **Real-time Communication**: WebSocket or Firebase for real-time updates between the mobile app and web portal.

## Features Breakdown ✨

### Mobile App (React Native)
- **Location Tracking**: Fetch the device’s current GPS coordinates using React Native’s built-in location APIs.
- **Background Location Update**: Ensure the app can update location even when running in the background.
- **Send Location to the Server**: Use HTTP requests or WebSocket to send updated location data to the backend (Node.js/Express).
- **Authentication**: Secure the app with user authentication (e.g., Firebase Auth or JWT).

### Web Portal (React.js)
- **Dashboard**: A map that displays real-time updates of the child's or bus’s location using Google Maps API for map embedding.
- **Shortest Route**: Allow users to input a location and calculate the optimized route from that location to the child’s current location using Google Directions API.
- **Marker Movement**: Dynamically move the marker on the map whenever the location updates.
- **User Authentication**: Create a login system with JWT or Firebase Authentication.
- **Geofencing**: Optionally add geofencing to alert users when the child or bus moves outside a defined area.

## Technology Stack 🛠️
- **Frontend**: React.js, Material UI/Bootstrap for styling, Google Maps API for map integration.
- **Backend**: Node.js, Express.js, MongoDB, WebSocket/Socket.IO for real-time communication.
- **Mobile App**: React Native, Expo, Google Maps API for location services.
- **Real-Time Updates**: WebSocket/Socket.IO or Firebase Realtime Database.

## Installation 🏗️

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/exclusiveabhi/gps-tracker.git
   cd gps-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up MongoDB:**
   
   - Create a MongoDB database and obtain your connection string.
   - Update the MongoDB URI in the `.env` file in the backend directory:

     ```env
     MONGODB_URI=your_mongodb_connection_string
     ```

4. **Start the development server:**

   ```bash
   npm start
   ```

5. **Open your browser and navigate to** `http://localhost:3000`.

## Usage 🚀

- **User Interface**: Navigate to the login/signup pages for users and bus personnel.
- **Map View**: View real-time location and routes on the map.

## Contributing 🤝

Contributions are welcome! Fork the repository and submit a PR with your changes.

## Acknowledgments

- **Leaflet**: Open-source JavaScript library for mobile-friendly interactive maps.
- **OpenStreetMap**: For mapping service.
- **GoogleMap**: For mapping API.

Happy Coding!