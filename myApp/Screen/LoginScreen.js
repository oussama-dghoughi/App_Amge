import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const LoginScreen = ({ onForgotAccount, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(`Email: ${email}, Password: ${password}`);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')} // Replace with your actual logo
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Login Box */}
      <View style={styles.loginBox}>
        <Text style={styles.header}>Log in</Text>

        {/* Email Input */}
        <TextInput
          style={[styles.input, styles.inputBorder]}
          placeholder="Adresse mail *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password Input */}
        <TextInput
          style={[styles.input, styles.inputBorder]}
          placeholder="Mot de passe *"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={onForgotAccount}>
            <Text style={styles.linkText}>Forgot account?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSignUp}>
            <Text style={styles.linkText}>Sign up?</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#fff', // Set background to white
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 40,
    marginBottom: 20,
  },
  loginBox: {
    width: '100%',
    backgroundColor: '#f0f0f0', // Light gray background for the box
    borderRadius: 10,
    padding: 20,
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
    color: '#005f73', // Matching blue color for the title
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 15,
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
  loginButton: {
    backgroundColor: '#005f73', // Deep blue button
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff', // White text for button
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  linkText: {
    color: '#005f73', // Deep blue for links
    fontSize: 14,
    textDecorationLine: 'underline',
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

export default LoginScreen;
