import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/HomeScreen/Header';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';

const Settings = ({ navigation }) => {
  const handleNotifs = () => {
    navigation.navigate('Notifs'); // Navigate to Registration screen
  };
  const handleChangePassword = () => {
    navigation.navigate('ChangePassword'); // Navigate to Registration screen
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header navigation={navigation} />
      </SafeAreaView>

      <ImageBackground
        source={require('../../assets/BackGround.jpeg')}
        style={styles.background}
        imageStyle={{ opacity: 0.35 }}
      >
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
          {/* Profile Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.profileContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>Prénom Nom</Text>
            </TouchableOpacity>
          </View>

          {/* Settings List */}
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>✏️ Modifier mon profil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleNotifs}>
              <Text style={styles.settingText}>🔔 Gérer les notifications</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
              <Text style={styles.settingText}>🔑 Paramètres de sécurité</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>📍 Paramètres de localisation</Text>
            </TouchableOpacity>
          </View>
          <BottomNavigationBar />
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    zIndex: 1, // Lower than header
  },
  container: {
    flex: 1,
    zIndex: 1,
  },
  headerSafeArea: {
    backgroundColor: '#fff',
    zIndex: 1000, // Match header z-index
    elevation: 10,
  },
  
  header: {
    backgroundColor: '#A34392',
    width: '100%',
    paddingVertical: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsContainer: {
    width: '90%',
    alignItems: 'stretch',
    alignSelf: 'center', // Center horizontally
  },
  settingItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Settings;