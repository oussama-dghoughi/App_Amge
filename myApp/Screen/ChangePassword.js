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

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = () => {
    console.log(`Old Password: ${oldPassword}`);
    console.log(`New Password: ${newPassword}`);
    console.log(`Confirm New Password: ${confirmNewPassword}`);
    // Handle password change logic
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
        <Text style={styles.header}>Change your password</Text>

        {/* Old Password Input */}
        <TextInput
          style={[styles.input, styles.inputBorder]}
          placeholder="Ancien mot de passe *"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />

        {/* New Password Input */}
        <TextInput
          style={[styles.input, styles.inputBorder]}
          placeholder="Nouveau mot de passe *"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        {/* Confirm New Password Input */}
        <TextInput
          style={[styles.input, styles.inputBorder]}
          placeholder="Confirmer votre nouveau mot de passe *"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
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
    backgroundColor: '#fff',
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
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 30,
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
    color: '#005f73',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    paddingLeft: 8,
    backgroundColor: '#eaf3f9',
    borderRadius: 5,
    fontSize: 14,
  },
  inputBorder: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#005f73',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
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

export default ChangePasswordScreen;
