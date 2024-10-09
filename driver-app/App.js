// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [busNumber, setBusNumber] = useState(''); // Changed from startingLocation and destinationLocation
  const [password, setPassword] = useState('');
  const [driverId, setDriverId] = useState(null);

  // SignUp / Login function
  const handleSignupOrLogin = async () => {
    try {
      const response = await axios.post('http://172.16.3.67:5000/api/signup', {
        name,
        busNumber, // Sending bus number
        password
      });
      setDriverId(response.data.driverId);
      await AsyncStorage.setItem('driverId', response.data.driverId);
      Alert.alert('Success', 'You are logged in, redirecting to location tracking...');
      navigation.navigate('TrackLocation'); // Navigate to TrackLocation screen
    } catch (error) {
      Alert.alert('Error', 'Signup/Login failed. Please try again.');
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Bus Number</Text> {/* Updated to Bus Number */}
      <TextInput value={busNumber} onChangeText={setBusNumber} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 10 }} />

      <Button title="Sign Up / Log In" onPress={handleSignupOrLogin} />
    </View>
  );
};

const TrackLocationScreen = () => {
  const [driverId, setDriverId] = useState(null);

  // Fetch driverId from AsyncStorage
  useEffect(() => {
    const fetchDriverId = async () => {
      const id = await AsyncStorage.getItem('driverId');
      setDriverId(id);
    };
    fetchDriverId();
  }, []);

  // Send location to backend
  const sendLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please enable location services');
      return;
    }

    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

    try {
      await axios.post('http://172.16.3.67:5000/api/send-location', {
        driverId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      Alert.alert('Location Sent', 'Your location has been sent to the database.');
    } catch (error) {
      console.error('Location update failed:', error);
      Alert.alert('Error', 'Failed to send location.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Track My Location" onPress={sendLocation} />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="TrackLocation" component={TrackLocationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
