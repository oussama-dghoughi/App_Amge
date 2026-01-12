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
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderMenu from '../../components/HomeScreen/Header';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Contact = ({ navigation }) => {
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

    console.log({ nom, email, sujet, message });
    showCustomAlert('Succès', 'Votre message a été envoyé avec succès!');
    setNom('');
    setEmail('');
    setSujet('');
    setMessage('');
  };

  const showCustomAlert = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK', style: 'default' }], { cancelable: true });
  };

  return (
    <SafeAreaProvider>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <HeaderMenu navigation={navigation} />
        </View>

        <ImageBackground
          source={require('../../assets/BackGround.jpeg')}
          style={styles.background}
          imageStyle={{ opacity: 0.50 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <LinearGradient
              colors={['#ffffff', '#ffffff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.headerText}>Contactez-nous</Text>
            </LinearGradient>

            {/* Form Container */}
            <View style={styles.formContainer}>
              {/* Input Fields */}
              <View style={styles.inputGroup}>
                <Icon name="account" size={20} color="#8a348a" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  value={nom}
                  onChangeText={(text) => setNom(text)}
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Icon name="email" size={20} color="#8a348a" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  keyboardType="email-address"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Icon name="format-title" size={20} color="#8a348a" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Sujet"
                  value={sujet}
                  onChangeText={(text) => setSujet(text)}
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Icon name="message-text" size={20} color="#8a348a" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Message"
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                  multiline
                  placeholderTextColor="#666"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <LinearGradient
                  colors={['#A34392', '#00a3b6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Envoyer</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Contact Information */}
              <View style={styles.contactInfo}>
                <Text style={styles.contactHeader}>Autres moyens de nous contacter</Text>
                
                <View style={styles.contactItem}>
                  <Icon name="email" size={24} color="#8a348a" />
                  <Text style={styles.contactText}>
                    <Text style={styles.contactLabel}>Email: </Text>
                    fhm@amge-caravane.com
                  </Text>
                </View>

                <View style={styles.contactItem}>
                  <Icon name="map-marker" size={24} color="#8a348a" />
                  <Text style={styles.contactText}>
                    <Text style={styles.contactLabel}>Adresse: </Text>
                    66 Avenue des Champs-Élysées lot 47, 75008 Paris, France
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>

        {/* Bottom Navigation Bar */}
        <View style={styles.navBarContainer}>
          <SafeAreaView edges={['bottom']}>
            <BottomNavigationBar navigation={navigation} />
          </SafeAreaView>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginTop: Platform.OS === 'ios' ? 45 : 25,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  headerGradient: {
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8a348a',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 15,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  contactText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  contactLabel: {
    fontWeight: 'bold',
    color: '#8a348a',
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