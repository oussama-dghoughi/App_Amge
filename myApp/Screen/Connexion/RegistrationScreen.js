import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome } from '@expo/vector-icons';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [domain, setDomain] = useState('');
  const [track, setTrack] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleSignUp = () => {
    if (!isChecked) {
      alert('You must agree to the legal conditions before signing up.');
      return;
    }
    console.log({ name, surname, email, password, status, domain, track, cvFile });
  };

  const handlePickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });
    if (result.type === 'success') {
      setCvFile(result);
    }
  };

  const toggleCheckbox = () => setIsChecked(!isChecked);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../../assets/logo.png')} // Ensure the path matches
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.formContainer}>
          <Text style={styles.header}>Register now</Text>

          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Nom*"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Prénom*"
            value={surname}
            onChangeText={setSurname}
          />
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Adresse mail*"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Mot de passe*"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={[styles.picker, styles.adjustedInput, styles.inputBorder]}
          >
            <Picker.Item label="Statut*" value="" />
            <Picker.Item label="Étudiant" value="student" />
            <Picker.Item label="Professionnel" value="professional" />
          </Picker>

          <Picker
            selectedValue={domain}
            onValueChange={(itemValue) => setDomain(itemValue)}
            style={[styles.picker, styles.adjustedInput, styles.inputBorder]}
          >
            <Picker.Item label="Domaine*" value="" />
            <Picker.Item label="Informatique" value="it" />
            <Picker.Item label="Ingénierie" value="engineering" />
          </Picker>

          <Picker
            selectedValue={track}
            onValueChange={(itemValue) => setTrack(itemValue)}
            style={[styles.picker, styles.adjustedInput, styles.inputBorder]}
          >
            <Picker.Item label="Parcours*" value="" />
            <Picker.Item label="Développement" value="development" />
            <Picker.Item label="Gestion de projet" value="project_management" />
          </Picker>

          <TouchableOpacity onPress={handlePickFile} style={styles.uploadButtonLarge}>
            <Text style={styles.cvUploadText}>
              {cvFile ? cvFile.name : 'Ajoutez votre CV (Facultatif)'}
            </Text>
            <FontAwesome name="cloud-upload" size={30} color="gray" style={styles.uploadIcon} />
          </TouchableOpacity>

          {/* Legal Conditions Checkbox */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity style={styles.checkbox} onPress={toggleCheckbox}>
              {isChecked && <View style={styles.checked} />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>By checking this box, you are agreeing to our terms of service.</Text>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactBar}>
          <Text style={styles.contactText}>Contact</Text>
          <View style={styles.iconsContainer}>
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
    padding: 20,
    paddingBottom: 80, // Add padding to avoid overlap with BottomNavigationBar
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
    color: '#005f73',
    fontFamily: 'Roboto',
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 18,
    backgroundColor: 'transparent',
  },
  adjustedInput: {
    fontSize: 16,
    paddingVertical: 12,
  },
  picker: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  uploadButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 18,
    marginBottom: 22,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cvUploadText: {
    fontSize: 16,
    color: 'gray',
  },
  uploadIcon: {
    marginLeft: 10,
  },
  signUpButton: {
    backgroundColor: '#005f73',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactBar: {
    alignItems: 'center',
    marginTop: 15,
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  contactText: {
    fontSize: 16,
    marginBottom: 12,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap',
    maxWidth: '85%',
  },
  checked: {
    width: 16,
    height: 16,
    backgroundColor: '#005f73',
  },
});

export default RegistrationScreen;