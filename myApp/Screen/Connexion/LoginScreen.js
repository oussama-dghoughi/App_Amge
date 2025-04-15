import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://172.20.10.2:5000/api/auth/login', {
        email,
        password
      });

      console.log('Réponse du serveur:', response.data);
      console.log('Données utilisateur reçues:', response.data.user);

      // Formatage des données utilisateur
      const userData = {
        name: response.data.user.name || response.data.user.firstName || '',
        surname: response.data.user.surname || response.data.user.lastName || '',
        email: response.data.user.email,
      };

      console.log('Données formatées:', userData);

      // Stockage des informations de l'utilisateur
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // Vérification des données stockées
      const storedData = await AsyncStorage.getItem('userData');
      console.log('Données stockées:', JSON.parse(storedData));

      // Réinitialisation des champs
      setEmail('');
      setPassword('');
      setIsLoading(false);

      // Redirection vers la page d'accueil
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.msg || 'Identifiants incorrects';
      Alert.alert('Erreur de connexion', errorMessage);
    }
  };

  const handleForgotAccount = () => {
    navigation.navigate('FindAccount'); // Navigate to Find Account screen
  };

  const handleSignUp = () => {
    navigation.navigate('Registration'); // Navigate to Registration screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')} // Replace with your actual logo
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Login Box */}
        <View style={styles.loginBox}>
          <Text style={styles.header}>Log in</Text>
          
          <Text style={styles.helpText}>Connectez-vous avec l'email et le mot de passe utilisés lors de l'inscription</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputBorder]}
              placeholder="Entrez votre adresse email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#7d8e98"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput
              style={[styles.input, styles.inputBorder]}
              placeholder="Entrez votre mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#7d8e98"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          {/* Footer Links */}
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={handleForgotAccount}>
              <Text style={styles.linkText}>Forgot account?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUp}>
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
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // White background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80, // Add padding to avoid overlap with BottomNavigationBar
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 40,
    marginBottom: 20,
  },
  loginBox: {
    width: '90%',
    backgroundColor: '#f0f0f0', // Light gray background for the box
    borderRadius: 10,
    padding: 30, // Increased padding for more space
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    fontSize: 26, // Larger font size for header
    fontWeight: '600',
    color: '#005f73', // Matching blue color for the title
    marginBottom: 20, // Increased margin to add space
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto', // Use system fonts for iOS and Android
  },
  input: {
    width: '100%',
    height: 45, // Increased height for better interaction
    marginBottom: 20, // Increased margin for more space between input and button
    paddingLeft: 15,
    backgroundColor: '#eaf3f9', // Light blue input field background
    borderRadius: 8,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto', // Consistent with the header font
  },
  inputBorder: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  loginButton: {
    backgroundColor: '#005f73', // Deep blue button
    borderRadius: 8,
    paddingVertical: 12, // Added padding for a larger button
    paddingHorizontal: 24, // Added padding for a larger button
    alignItems: 'center',
    width: '100%',
    marginTop: 20, // Increased margin for more spacing
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
    marginTop: 20, // Increased margin for more spacing
  },
  linkText: {
    color: '#005f73', // Deep blue for links
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
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
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#005f73',
    marginBottom: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#cccccc',
  },
});

export default LoginScreen;