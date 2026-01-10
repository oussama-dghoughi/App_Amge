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
    if (isMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 400,
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color="#7E57C2" />
        </TouchableOpacity>

        <Image
          source={require('../../assets/Logo_2026.png')}
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
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <Image
                  source={require('../../assets/Logo_2026.png')}
                  style={{ width: 60, height: 50, marginBottom: 15 }}
                  resizeMode="contain"
                />
              </View>

              {/* Menu Items */}
              {(() => {
                const MenuItem = ({ iconName, label, onPress }) => (
                  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
                    <Icon name={iconName} size={22} color="#8a348a" />
                    <Text style={styles.menuText}>{label}</Text>
                  </TouchableOpacity>
                );

                return (
                  <>
                    <MenuItem iconName="home" label="Accueil" onPress={() => navigation.navigate('Home')} />
                    <MenuItem iconName="compass" label="Guide Forum" onPress={() => navigation.navigate('GuideForum')} />
                    <MenuItem iconName="map-marker" label="Localisation" onPress={() => navigation.navigate('Localisation')} />
                    <MenuItem iconName="help-circle-outline" label="FAQ" onPress={() => navigation.navigate('FAQ')} />
                    <MenuItem iconName="information-outline" label="À propos" onPress={() => navigation.navigate('About')} />
                    <MenuItem iconName="phone" label="Contactez-nous" onPress={() => navigation.navigate('Contact')} />
                  </>
                );
              })()}
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
  },
});

export default HeaderMenu; 