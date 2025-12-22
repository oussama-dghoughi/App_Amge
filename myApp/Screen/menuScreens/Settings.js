import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderMenu from '../../components/MenuScreens/HeaderMenu';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Settings = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Prénom',
    surname: 'Nom',
    email: 'utilisateur@email.com',
  });

  // ✅ Works with nested navigators:
  // - tries to reset parent navigator if it exists
  // - otherwise resets current navigator
  const resetToLogin = useCallback(() => {
    const parent = navigation.getParent?.();
    if (parent?.reset) {
      parent.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }

    // fallback (if Settings is already in the same stack as Login)
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, [navigation]);

  const loadUserData = useCallback(async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      // ✅ If not logged in => go to Login safely (nested nav friendly)
      if (!isLoggedIn || !userDataString) {
        resetToLogin();
        return;
      }

      const userDataObj = JSON.parse(userDataString);
      setUserData(userDataObj);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données utilisateur');
    }
  }, [resetToLogin]);

  useEffect(() => {
    loadUserData();

    // ✅ reload on focus
    const unsubscribe = navigation.addListener('focus', loadUserData);
    return unsubscribe;
  }, [navigation, loadUserData]);

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['userToken', 'userData', 'isLoggedIn']);
            resetToLogin();
          } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            Alert.alert('Erreur', 'Impossible de se déconnecter');
          }
        },
      },
    ]);
  };

  const handleNotifs = () => navigation.navigate('Notifs');

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.mainContainer}>
        {/* ✅ Keep header inside a SafeAreaView instead of hardcoded marginTop */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeHeader}>
          <HeaderMenu navigation={navigation} />
        </SafeAreaView>

        <ImageBackground
          source={require('../../assets/BackGround.jpeg')}
          style={styles.background}
          imageStyle={{ opacity: 0.15 }}
        >
          <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            <View style={styles.settingsContainer}>
              <TouchableOpacity style={styles.settingItem} onPress={handleNotifs}>
                <Icon name="bell-outline" size={24} color="#8a348a" style={styles.settingIcon} />
                <Text style={styles.settingText}>Gérer les notifications</Text>
              </TouchableOpacity>

              {/* (Optional) logout button if you want it visible */}
              {/* 
              <TouchableOpacity style={[styles.settingItem, styles.logoutButton]} onPress={handleLogout}>
                <Icon name="logout" size={24} color="#8a348a" style={styles.settingIcon} />
                <Text style={styles.settingText}>Déconnexion</Text>
              </TouchableOpacity>
              */}
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

  // ✅ no more marginTop hacks
  safeHeader: {
    backgroundColor: '#fff',
  },

  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  settingsContainer: {
    width: '90%',
    alignItems: 'stretch',
    alignSelf: 'center',
    paddingBottom: 80,
    paddingTop: 20,
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
