import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderMenu from '../../components/MenuScreens/HeaderMenu';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Settings = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Prénom',
    surname: 'Nom',
    email: 'utilisateur@email.com'
  });

  useEffect(() => {
    loadUserData();
    // Ajouter un listener pour recharger les données quand l'écran devient actif
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      
      if (!isLoggedIn || !userDataString) {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      if (userDataString) {
        const userDataObj = JSON.parse(userDataString);
        setUserData(userDataObj);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données utilisateur');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Déconnexion',
          onPress: async () => {
            try {
              // Supprimer toutes les données de session
              await AsyncStorage.multiRemove(['userToken', 'userData', 'isLoggedIn']);
              // Rediriger vers la page de connexion
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userData });
  };

  const handleNotifs = () => {
    navigation.navigate('Notifs');
  };
  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };
  const handleHome = () => {
    navigation.navigate('Home');
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
          <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            {/* Settings List - uniquement Gérer les notifications */}
            <View style={styles.settingsContainer}>
              <TouchableOpacity style={styles.settingItem} onPress={handleNotifs}>
                <Icon name="bell-outline" size={24} color="#8a348a" style={styles.settingIcon} />
                <Text style={styles.settingText}>Gérer les notifications</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomNavContainer}>
              <BottomNavigationBar navigation={navigation} />
            </View>
          </SafeAreaView>
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
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    padding: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 45,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  settingsContainer: {
    width: '90%',
    alignItems: 'stretch',
    alignSelf: 'center',
    paddingBottom: 80,
  },
  settingItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#8a348a',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default Settings;