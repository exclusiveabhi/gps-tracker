import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const HomeScreen = ({ route }) => {
  const { busNumber } = route.params;
  const [isTracking, setIsTracking] = useState(false);

  const trackLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    setIsTracking(true);

    // Watch position and update location every 10 seconds
    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 10 },
      (location) => {
        axios.post('http://192.168.75.51:3000/update-location', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
        .catch(error => {
          if (error.response) {
            // Server responded with a status other than 200 range
            Alert.alert('Error', error.response.data);
          } else if (error.request) {
            // Request was made but no response received
            Alert.alert('Error', 'No response from server');
          } else {
            // Something else happened while setting up the request
            Alert.alert('Error', error.message);
          }
        });
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text>Welcome, Bus {busNumber} Driver!</Text>
      <Button
        title={isTracking ? "Tracking..." : "Track My Location"}
        onPress={trackLocation}
        color={isTracking ? "green" : "blue"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default HomeScreen;