import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Add this import
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';

const Contact = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [sujet, setSujet] = useState('');
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!nom.trim() || !email.trim() || !sujet.trim() || !message.trim()) {
      showCustomAlert('Erreur', 'Veuillez remplir tous les champs avant d\'envoyer.');
      return;
    }

    if (!validateEmail(email)) {
      showCustomAlert('Erreur', 'Veuillez entrer une adresse email valide.');
      return;
    }

    console.log({
      nom,
      email,
      sujet,
      message,
    });

    showCustomAlert('Succès', 'Votre message a été envoyé avec succès!');
    setNom('');
    setEmail('');
    setSujet('');
    setMessage('');
  };

  const showCustomAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          style: 'default',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.headerText}>Contactez-nous</Text>

        {/* Input Fields - NOW RESTORED */}
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={(text) => setNom(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Sujet"
          value={sujet}
          onChangeText={(text) => setSujet(text)}
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Message"
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>

        {/* Contact Information */}
        <View style={styles.contactInfo}>
          <Text style={styles.contactHeader}>Autres moyens de nous contacter</Text>
          <Text style={styles.contactText}>
            📧 <Text style={styles.contactLabel}>Email:</Text> fhm@amge-caravane.com
          </Text>
          <Text style={styles.contactText}>
            📍 <Text style={styles.contactLabel}>Adresse:</Text> 66 Avenue des Champs-Élysées lot 47, 75008 Paris, France
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBarContainer}>
        <SafeAreaView edges={['bottom']}>
          <BottomNavigationBar />
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100, // Space for navigation bar
  },
  // Keep all your original styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8a348a',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    height: 50,
    backgroundColor: '#8a348a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfo: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
    alignItems: 'center',
  },
  contactHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  contactLabel: {
    fontWeight: 'bold',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Contact;