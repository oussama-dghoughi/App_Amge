import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
  Platform,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons
import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import Body from '../components/HomeScreen/Body';

const HomeScreen = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen

  const handleMenuPress = () => {
    setMenuVisible(!isMenuVisible);
    Animated.timing(slideAnim, {
      toValue: isMenuVisible ? -300 : 0, // Slide in or out
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleProfilePress = () => {
    console.log('Profile button pressed');
  };

  const MenuContent = () => (
    <View style={styles.menuContent}>
      {/* Log in button at the top right of the menu */}
      <TouchableOpacity style={styles.logginContainer}>
        <Icon name="login" size={24} color="#333" />
        <Text style={styles.loggingText}>Se connecter</Text>
      </TouchableOpacity>

      {/* Menu Items */}
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="cog" size={24} color="#333" style={styles.menuIcon} />
        <Text style={styles.menuText}>Paramètres</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="map-marker" size={24} color="#333" style={styles.menuIcon} />
        <Text style={styles.menuText}>Localisation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="compass" size={24} color="#333" style={styles.menuIcon} />
        <Text style={styles.menuText}>Guide Forum</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="help-circle-outline" size={24} color="#333" style={styles.menuIcon} />
        <Text style={styles.menuText}>FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="information-outline" size={24} color="#333" style={styles.menuIcon} />
        <Text style={styles.menuText}>À propos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="phone" size={24} color="#333" style={styles.menuIcon} />
        <Text style={styles.menuText}>Contactez-nous</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      {/* Background Image */}
      <ImageBackground
        source={require('../assets/BackGround.jpeg')}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        {/* SafeAreaView */}
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          {/* StatusBar */}
          <StatusBar
            backgroundColor="#fff" // White background for Android
            barStyle="dark-content" // Dark text/icons for iOS
            translucent={Platform.OS === 'android'} // Transparent for Android
          />

          {/* Header */}
          <View style={styles.headerContainer}>
            <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress} />
          </View>
        </SafeAreaView>

        {/* Body */}
        <SafeAreaView style={styles.contentContainer} edges={['left', 'right']}>
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <Body />
          </ScrollView>

          {/* Bottom Navigation Bar */}
          <BottomNavigationBar />
        </SafeAreaView>

        {/* Sidebar Menu */}
        <Animated.View
          style={[
            styles.sidebarMenu,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <MenuContent />
        </Animated.View>

        {/* Overlay for closing the menu */}
        {isMenuVisible && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={handleMenuPress}
          />
        )}
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: '#fff', // White background for the status bar area
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent', // Ensure the image shows through
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#fff', // Match the status bar background
  },
  bodyContainer: {
    flexGrow: 1,
    paddingBottom: 60,
    paddingTop: 20,
  },
  sidebarMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 300,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20, // Add safe padding for both iOS and Android
    paddingHorizontal: 15,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  menuContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logginContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align to the right
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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
});

export default HomeScreen;
