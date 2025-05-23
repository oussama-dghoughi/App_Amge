import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Text,
  Platform,
  Dimensions,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HeaderMenu = (props) => {
  const navigation = props.navigation || useNavigation();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

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

        {/* Icône vide pour garder l'espacement */}
        <View style={styles.iconContainer} />
      </View>

      {/* Menu Container rendu dans un Modal natif */}
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={handleMenuPress}
      >
        <View style={styles.menuWrapper}>
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
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Image source={require('../../assets/logo.png')} style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8 }} />
                <Text style={{ color: '#8a348a', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Forum Horizons Maroc</Text>
              </View>

              {/* Menu Items */}
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
                <Icon name="home" size={24} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>Accueil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('GuideForum')}>
                <Icon name="book-open-variant" size={24} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>Guide Forum</Text>
              </TouchableOpacity>

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
            </View>
          </Animated.View>
        </View>
      </Modal>
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
});

export default HeaderMenu; 