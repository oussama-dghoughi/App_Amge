import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Text,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const HeaderMenu = ({ navigation }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    checkLoginStatus();
    // Ajouter un listener pour la navigation
    const unsubscribe = navigation.addListener('focus', () => {
      checkLoginStatus();
    });
    return unsubscribe;
  }, [navigation]);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userDataString = await AsyncStorage.getItem('userData');
      console.log('Token dans HeaderMenu:', userToken);
      console.log('Données utilisateur dans HeaderMenu:', userDataString);
      
      setIsLoggedIn(!!userToken);
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        console.log('Données parsées dans HeaderMenu:', parsedUserData);
        setUserData(parsedUserData);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
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
              await AsyncStorage.multiRemove(['userToken', 'userData', 'isLoggedIn']);
              setIsLoggedIn(false);
              setUserData(null);
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

  const handleMenuPress = () => {
    setMenuVisible((prevState) => {
      const newState = !prevState;
      Animated.spring(slideAnim, {
        toValue: newState ? 0 : -300,
        duration: 300,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
      return newState;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color="#7E57C2" />
        </TouchableOpacity>

        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity 
          style={styles.iconContainer} 
          onPress={() => isLoggedIn ? navigation.navigate('Settings') : navigation.navigate('Login')}
        >
          <Ionicons name="person" size={24} color="#7E57C2" />
        </TouchableOpacity>
      </View>

      {/* Menu Container */}
      <View style={[
        styles.menuWrapper,
        { display: isMenuVisible ? 'flex' : 'none' }
      ]}>
        {/* Overlay */}
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={handleMenuPress}
        />
        
        {/* Sidebar Menu */}
        <Animated.View 
          style={[
            styles.sidebarMenu,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.menuContent}>
            {/* User Profile or Login Button */}
            {isLoggedIn ? (
              <View style={styles.userProfileContainer}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userData?.name} {userData?.surname}</Text>
                  <Text style={styles.userEmail}>{userData?.email}</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.logginContainer} 
                onPress={() => navigation.navigate('Login')}
              >
                <Icon name="login" size={24} color="#8a348a" />
                <Text style={styles.loggingText}>Se connecter</Text>
              </TouchableOpacity>
            )}

            {/* Menu Items */}
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
              <Icon name="home" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>Accueil</Text>
            </TouchableOpacity>

            {isLoggedIn && (
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
                <Icon name="cog" size={24} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>Paramètres</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Localisation')}>
              <Icon name="map-marker" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>Localisation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FAQ')}>
              <Icon name="help-circle-outline" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>FAQ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
              <Icon name="information-outline" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>À propos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Contact')}>
              <Icon name="phone" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>Contactez-nous</Text>
            </TouchableOpacity>

            {isLoggedIn && (
              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutButton]} 
                onPress={handleLogout}
              >
                <Icon name="logout" size={24} color="#fff" style={styles.menuIcon} />
                <Text style={styles.logoutText}>Se déconnecter</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 999999,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  iconContainer: {
    padding: 10,
  },
  logo: {
    height: 40,
    flex: 1,
    marginHorizontal: 10,
  },
  menuWrapper: {
    position: 'absolute',
    width: width,
    height: height,
    left: 0,
    top: 0,
    zIndex: 999999,
  },
  sidebarMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 300,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 999999,
    zIndex: 999999,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  menuContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logginContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(138, 52, 138, 0.2)',
  },
  loggingText: {
    fontSize: 16,
    color: '#8a348a',
    marginLeft: 10,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginVertical: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(138, 52, 138, 0.05)',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#8a348a',
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999998,
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(138, 52, 138, 0.2)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#8a348a',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HeaderMenu; 