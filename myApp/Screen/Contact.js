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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} // Replace with the correct path to your logo file
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.headerText}>Contactez-nous</Text>

      {/* Input Fields */}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
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
    alignItems: 'center', // Center the content horizontally
  },
  contactHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 10,
    textAlign: 'center', // Center the header text
  },
  contactText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center', // Center the text content
  },
  contactLabel: {
    fontWeight: 'bold',
  },
});

export default Contact;
