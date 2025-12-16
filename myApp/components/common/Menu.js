import React from 'react';
import { Animated, TouchableOpacity, View , Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Menu = ({ isMenuVisible, slideAnim, handleMenuPress }) => {
  const navigation = useNavigation();

  // Your menu content JSX from HomeScreen
  const handleLoginPress = () => {
    navigation.navigate('Login');
    handleMenuPress && handleMenuPress();
  };

  const handleLocalisation = () => {
    navigation.navigate('Localisation');
    handleMenuPress && handleMenuPress();
  };

  const handleOffres = () => {
    navigation.navigate('Offres');
    handleMenuPress && handleMenuPress();
  };

  const handleFAQ = () => {
    navigation.navigate('FAQ');
    handleMenuPress && handleMenuPress();
  };

  const handleAbout = () => {
    navigation.navigate('About');
    handleMenuPress && handleMenuPress();
  };

  const handleContact = () => {
    navigation.navigate('Contact');
    handleMenuPress && handleMenuPress();
  };

  return (
    <>
      <Animated.View
        style={[
          styles.sidebarMenu,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.menuContent}>
          {/* Logo et titre en haut du menu */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Image source={require('../../assets/logo.png')} style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8 }} />
            <Text style={{ color: '#8a348a', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Forum Horizons Maroc</Text>
          </View>

          {/* Menu Items */}
          <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Settings'); handleMenuPress && handleMenuPress(); }}>
              <Icon name="cog" size={24} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>Paramètres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLocalisation}>
              <Icon name="map-marker" size={24} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>Localisation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleOffres}>
              <Icon name="briefcase" size={24} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>Offres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('GuideForum'); handleMenuPress && handleMenuPress(); }}>
              <Icon name="book-open-variant" size={24} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>Guide Forum</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleFAQ}>
              <Icon name="help-circle-outline" size={24} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}  onPress={handleAbout}>
              <Icon name="information-outline" size={24} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>À propos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleContact}>
              <Icon name="phone" size={24} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>Contactez-nous</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {isMenuVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleMenuPress}
        />
      )}
    </>
  );
};

const styles = {
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
  sidebarMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    paddingTop: 60,
    paddingHorizontal: 20,
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
};

export default Menu;