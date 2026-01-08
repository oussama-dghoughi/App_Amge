import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderMenu from '../../components/MenuScreens/HeaderMenu';

const EditProfile = ({ route, navigation }) => {
  const { userData: initialUserData } = route.params;
  
  // Ajouter un console.log pour déboguer
  console.log('userData reçu:', initialUserData);
  
  const [formData, setFormData] = useState({
    name: initialUserData?.name || '',
    surname: initialUserData?.surname || '',
    email: initialUserData?.email || '',
    phone: initialUserData?.phone || '',
    address: initialUserData?.address || '',
  });

  const handleSave = async () => {
    try {
      // Validation des champs
      if (!formData.name || !formData.surname || !formData.email) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Validation du format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
        return;
      }

      // Sauvegarder les données
      await AsyncStorage.setItem('userData', JSON.stringify(formData));
      Alert.alert(
        'Succès',
        'Vos informations ont été mises à jour',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications');
    }
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
          imageStyle={{ opacity: 0.15 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView style={styles.scrollView}>
              <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <LinearGradient
                  colors={['#A34392', '#8a348a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.header}
                >
                  <Text style={styles.headerTitle}>Modifier mon profil</Text>
                  <Text style={styles.headerSubtitle}>Mettez à jour vos informations personnelles</Text>
                </LinearGradient>

                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Icon name="account" size={24} color="#8a348a" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Prénom"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      placeholderTextColor="#666"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Icon name="account-outline" size={24} color="#8a348a" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nom"
                      value={formData.surname}
                      onChangeText={(text) => setFormData({ ...formData, surname: text })}
                      placeholderTextColor="#666"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Icon name="email" size={24} color="#8a348a" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#666"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Icon name="phone" size={24} color="#8a348a" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Téléphone"
                      value={formData.phone}
                      onChangeText={(text) => setFormData({ ...formData, phone: text })}
                      keyboardType="phone-pad"
                      placeholderTextColor="#666"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Icon name="map-marker" size={24} color="#8a348a" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Adresse"
                      value={formData.address}
                      onChangeText={(text) => setFormData({ ...formData, address: text })}
                      placeholderTextColor="#666"
                    />
                  </View>

                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <LinearGradient
                      colors={['#A34392', '#8a348a']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditProfile; 