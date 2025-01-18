import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FindAccountScreen = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log(`Email: ${email}`);
    // Handle account recovery logic
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')} // Replace with your actual logo
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Content Box */}
      <View style={styles.contentBox}>
        <Text style={styles.header}>Find your account</Text>
        <Text style={styles.subHeader}>
          Please enter your email to search for your account.
        </Text>

        {/* Email Input */}
        <TextInput
          style={[styles.input, styles.inputBorder]}
          placeholder="Adresse mail *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Contact</Text>
        <View style={styles.socialIcons}>
          <FontAwesome name="instagram" size={24} color="#000" style={styles.icon} />
          <FontAwesome name="facebook" size={24} color="#000" style={styles.icon} />
          <FontAwesome name="envelope" size={24} color="#000" style={styles.icon} />
          <FontAwesome name="linkedin" size={24} color="#000" style={styles.icon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 40,
    marginBottom: 20,
  },
  contentBox: {
    width: '100%',
    backgroundColor: '#f0f0f0', // Light gray background for the box
    borderRadius: 10,
    padding: 30, // Increased padding for more space
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005f73', // Matching blue color
    marginBottom: 20, // Increased margin to add space
  },
  subHeader: {
    fontSize: 16, // Slightly larger font size for readability
    color: '#666', // Softer gray color for a sleek look
    fontStyle: 'italic', // Adds an elegant italic style
    fontFamily: 'Roboto-Light', // Use a light font variant for a modern look
    marginBottom: 30, // Increased margin to add space
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20, // Increased margin for more space between input and button
    paddingLeft: 8,
    backgroundColor: '#eaf3f9', // Light blue input field background
    borderRadius: 5,
    fontSize: 14,
  },
  inputBorder: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#005f73', // Deep blue button
    borderRadius: 5,
    paddingVertical: 12, // Added padding for a larger button
    paddingHorizontal: 24, // Added padding for a larger button
    alignItems: 'center',
    width: '100%',
    marginTop: 20, // Increased margin for more spacing
  },
  submitButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default FindAccountScreen;
