import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({ navigation }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const handleMenuPress = () => {
    setMenuVisible((prevState) => {
      const newState = !prevState;
      Animated.timing(slideAnim, {
        toValue: newState ? 0 : -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return newState;
    });
  };

  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Menu Icon */}
        <TouchableOpacity style={styles.iconContainer} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color="#7E57C2" />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Profile Icon */}
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#7E57C2" />
        </TouchableOpacity>
      </View>

      {/* Sidebar Menu */}
      <Animated.View style={[styles.sidebarMenu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.menuContent}>
          {/* Log in button */}
          <TouchableOpacity style={styles.logginContainer} onPress={() => navigation.navigate('Login')}>
            <Icon name="login" size={24} color="#333" />
            <Text style={styles.loggingText}>Se connecter</Text>
          </TouchableOpacity>

          {/* Menu Items */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
            <Icon name="cog" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Paramètres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Localisation')}>
            <Icon name="map-marker" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Localisation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Guide')}>
            <Icon name="compass" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Guide Forum</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FAQ')}>
            <Icon name="help-circle-outline" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
            <Icon name="information-outline" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>À propos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Contact')}>
            <Icon name="phone" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Contactez-nous</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Overlay to close menu when clicked outside */}
      {isMenuVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleMenuPress} />
      )}
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
  },
  iconContainer: {
    padding: 10,
  },
  logo: {
    height: 40,
    flex: 1,
    marginHorizontal: 10,
  },
  sidebarMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 300,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 15,
    zIndex: 10000, // Very high value
    elevation: 50, // For Android
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  menuContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logginContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  loggingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // Just below menu
    elevation: 49, // Just below menu
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
});

export default Header;
