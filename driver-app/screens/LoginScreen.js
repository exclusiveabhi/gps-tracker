import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [busNumber, setBusNumber] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await axios.post('http://192.168.75.51:3000/login', { busNumber, password });
      const { token } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigation.navigate('Home', { busNumber });
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        Alert.alert('Login failed', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        Alert.alert('Login failed', 'No response from server');
      } else {
        // Something else happened while setting up the request
        Alert.alert('Login failed', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Bus Number"
        value={busNumber}
        onChangeText={setBusNumber}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={login} />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;