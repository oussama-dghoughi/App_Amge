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

const Header = ({ navigation }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Oui", 
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userToken', 'userData']);
              setUserData(null);
              navigation.replace('Login');
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
            }
          }
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
    <>
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

        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Settings')}>
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
            {/* User Profile Section */}
            {userData ? (
              <View style={styles.userSection}>
                <View style={styles.userAvatar}>
                  <Ionicons name="person-circle" size={60} color="#7E57C2" />
                </View>
                <Text style={styles.userName}>{userData.nom} {userData.prenom}</Text>
                <Text style={styles.userEmail}>{userData.email}</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Icon name="logout" size={20} color="#fff" />
                  <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.logginContainer} 
                onPress={() => {
                  handleMenuPress();
                  navigation.navigate('Login');
                }}
              >
                <Icon name="login" size={24} color="#8a348a" />
                <Text style={styles.loggingText}>Se connecter</Text>
              </TouchableOpacity>
            )}

            {/* Menu Items */}
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
              <Icon name="cog" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>Paramètres</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CompanyList')}>
              <Icon name="building" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>Entreprises</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Plan')}>
              <Icon name="map" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>Plan du salon</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Location')}>
              <Icon name="map-marker" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>Localisation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Guide')}>
              <Icon name="compass" size={24} color="#8a348a" style={styles.menuIcon} />
              <Text style={styles.menuText}>Guide Forum</Text>
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
          </View>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    paddingTop: 0,
  },
  iconContainer: {
    padding: 10,
    marginTop: 27,
  },
  logo: {
    height: 40,
    flex: 1,
    marginHorizontal: 10,
  },
  menuWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    zIndex: 999999,
    elevation: 999999,
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
    color: '#8a348a',
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
    elevation: 999998,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(138, 52, 138, 0.2)',
    marginBottom: 20,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7E57C2',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7E57C2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Header;
