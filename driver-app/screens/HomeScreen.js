import React from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const HomeScreen = ({ route }) => {
  const { busNumber } = route.params;

  const trackLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 10 },
      (location) => {
        axios.post('http://localhost:3000/update-location', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text>Welcome, Bus {busNumber} Driver!</Text>
      <Button title="Track My Location" onPress={trackLocation} />
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