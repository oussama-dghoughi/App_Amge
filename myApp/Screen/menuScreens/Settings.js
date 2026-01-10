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
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderMenu from '../../components/HomeScreen/Header';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Settings = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Invité',
    surname: '',
    email: ''
  });
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    loadUserData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken && userDataString) {
        setIsGuest(false);
        const userDataObj = JSON.parse(userDataString);
        setUserData(userDataObj);
      } else {
        setIsGuest(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleLogout = async () => {
    if (isGuest) {
      // Si invité, on redirige vers Login pour se connecter
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }

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
              await AsyncStorage.multiRemove(['userToken', 'userData', 'isLoggedIn']);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleNotifs = () => {
    if (isGuest) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour gérer les notifications.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Se connecter", onPress: () => navigation.replace('Login') }
        ]
      );
    } else {
      navigation.navigate('Notifs');
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
          <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            {/* Header Profile ou Guest */}
            <View style={styles.header}>
              <View style={styles.profileContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={isGuest ? require('../../assets/logo.png') : require('../../assets/logo.png')} // Placeholder avatar
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {isGuest ? 'Mode Invité' : `${userData.name} ${userData.surname}`}
                  </Text>
                  {!isGuest && <Text style={styles.profileEmail}>{userData.email}</Text>}
                </View>
              </View>
            </View>

            {/* Settings List */}
            <View style={styles.settingsContainer}>
              <TouchableOpacity style={styles.settingItem} onPress={handleNotifs}>
                <Icon name="bell-outline" size={24} color="#8a348a" style={styles.settingIcon} />
                <Text style={styles.settingText}>Gérer les notifications</Text>
              </TouchableOpacity>

              {/* Bouton Connexion / Déconnexion */}
              <TouchableOpacity style={[styles.settingItem, styles.logoutButton]} onPress={handleLogout}>
                <Icon name={isGuest ? "login" : "logout"} size={24} color="white" style={styles.settingIcon} />
                <Text style={styles.logoutText}>{isGuest ? "Se connecter" : "Se déconnecter"}</Text>
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
    // Ombre retirée ici car gérée par ImageBackground ou pas nécessaire sur fond transparent
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(138, 52, 138, 0.8)', // Fond semi-transparent pour lisibilité
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 15,
  },
  imageContainer: {
    padding: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 45,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
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