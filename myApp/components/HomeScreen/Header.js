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

const Header = ({ navigation, openMenu }) => {
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
    if (isMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 350,
        useNativeDriver: true,
        easing: require('react-native').Easing.inOut(require('react-native').Easing.ease),
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: require('react-native').Easing.inOut(require('react-native').Easing.ease),
      }).start();
    }
  };

  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={openMenu ? openMenu : handleMenuPress}>
          <Ionicons name="menu" size={24} color="#7E57C2" />
        </TouchableOpacity>

        <Image
          source={require('../../assets/Logo_2026.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Notifs')}>
          <Ionicons name="notifications-outline" size={24} color="#7E57C2" />
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
            {/* Logo et titre en haut du menu */}
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
              <Image
                source={require('../../assets/Logo_2026.png')}
                style={{ width: 80, height: 70, marginBottom: 15 }}
                resizeMode="contain"
              />
            </View>

            {/* Menu Items - Composant interne pour éviter duplication */}
            {/* MenuItem Component */}
            {(() => {
              const MenuItem = ({ iconName, label, onPress }) => (
                <TouchableOpacity style={styles.menuItem} onPress={onPress}>
                  <Icon name={iconName} size={22} color="#8a348a" />
                  <Text style={styles.menuText}>{label}</Text>
                </TouchableOpacity>
              );

              return (
                <>
                  <MenuItem iconName="cog" label="Paramètres" onPress={() => navigation.navigate('Settings')} />
                  <MenuItem iconName="office-building" label="Entreprises" onPress={() => navigation.navigate('CompanyList')} />
                  <MenuItem iconName="map" label="Plan du salon" onPress={() => navigation.navigate('Plan')} />
                  <MenuItem iconName="map-marker" label="Localisation" onPress={() => navigation.navigate('Localisation')} />
                  <MenuItem iconName="compass" label="Guide Forum" onPress={() => navigation.navigate('GuideForum')} />
                  <MenuItem iconName="help-circle-outline" label="FAQ" onPress={() => navigation.navigate('FAQ')} />
                  <MenuItem iconName="information-outline" label="À propos" onPress={() => navigation.navigate('About')} />
                  <MenuItem iconName="phone" label="Contactez-nous" onPress={() => navigation.navigate('Contact')} />
                </>
              );
            })()}
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#F2F3F5',
  },
  menuText: {
    fontSize: 14.5,
    color: '#8a348a',
    fontWeight: '600',
    marginLeft: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999998,
    elevation: 999998,
  },
});

export default Header;
