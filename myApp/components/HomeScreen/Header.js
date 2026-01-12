import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Text,
  Alert,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MENU_WIDTH = 300;

const Header = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [isMenuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // We use this flag so the animation starts ONLY when Modal is truly shown (iOS fix)
  const shouldAnimateOpenRef = useRef(false);

  useEffect(() => {
    checkLoginStatus();
    
    // Add listener to refresh when menu becomes visible
    const unsubscribe = navigation.addListener('focus', () => {
      checkLoginStatus();
    });

    return unsubscribe;
  }, [navigation]);

  const checkLoginStatus = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      
      if (userDataString && loginStatus === 'true') {
        setUserData(JSON.parse(userDataString));
        setIsLoggedIn(true);
      } else {
        setUserData(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      setIsLoggedIn(false);
    }
  };

  const resetAnimValues = useCallback(() => {
    overlayAnim.setValue(0);
    slideAnim.setValue(-MENU_WIDTH);
  }, [overlayAnim, slideAnim]);

  const runOpenAnim = useCallback(() => {
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();
  }, [overlayAnim, slideAnim]);

  const runCloseAnim = useCallback(() => {
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: -MENU_WIDTH,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setMenuVisible(false);
    });
  }, [overlayAnim, slideAnim]);

  const openLocalMenu = () => {
    resetAnimValues();
    shouldAnimateOpenRef.current = true;
    setMenuVisible(true);
    // Refresh login status when menu opens
    checkLoginStatus();
  };

  const closeLocalMenu = () => {
    shouldAnimateOpenRef.current = false;
    runCloseAnim();
  };

  const handleMenuPress = () => {
    if (isMenuVisible) return closeLocalMenu();
    openLocalMenu();
  };

  const goTo = (routeName) => {
    closeLocalMenu();
    navigation.navigate(routeName);
  };

  const handleLogin = () => {
    closeLocalMenu();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleLogout = async () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Oui',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['userToken', 'userData', 'isLoggedIn']);
            setUserData(null);
            setIsLoggedIn(false);
            closeLocalMenu();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
          }
        },
      },
    ]);
  };

  return (
    <>
      {/* Header bar */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleMenuPress} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color="#7E57C2" />
        </TouchableOpacity>

        <Image source={require('../../assets/Logo_2026.png')} style={styles.logo} resizeMode="contain" />

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('Notifs')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#7E57C2" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={isMenuVisible}
        animationType="none"
        presentationStyle="overFullScreen"
        onRequestClose={closeLocalMenu}
        onShow={() => {
          // ✅ iOS: safe-area is correct only when Modal is shown
          if (shouldAnimateOpenRef.current) runOpenAnim();
        }}
        statusBarTranslucent={Platform.OS === 'android'}
      >
        <View style={styles.modalRoot}>
          {/* Overlay */}
          <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
            <Pressable style={StyleSheet.absoluteFillObject} onPress={closeLocalMenu} />
          </Animated.View>

          {/* Sidebar */}
          <Animated.View style={[styles.sidebarMenu, { transform: [{ translateX: slideAnim }] }]}>
            {/* ✅ Use insets.top directly (no "first time safe area" bug) */}
            <View style={[styles.sidebarInner, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
              <View style={styles.menuTop}>
                <Image
                  source={require('../../assets/Logo_2026.png')}
                  style={styles.menuTopLogo}
                  resizeMode="contain"
                />
                {/* Show user name if logged in, otherwise show "Invité" */}
                {isLoggedIn && userData?.name ? (
                  <Text style={styles.menuTopUser} numberOfLines={1}>
                    {userData.surname + ' ' + userData.name}
                  </Text>
                ) : (
                  <Text style={styles.menuTopUser} numberOfLines={1}>
                    Invité
                  </Text>
                )}
              </View>

              <TouchableOpacity style={styles.menuItem} onPress={() => goTo('Settings')}>
                <Icon name="cog" size={22} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>Paramètres</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => goTo('CompanyList')}>
                <Icon name="office-building" size={22} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>Entreprises</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => goTo('Plan')}>
                <Icon name="map" size={22} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>Plan du salon</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => goTo('Localisation')}>
                <Icon name="map-marker" size={22} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>Localisation</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => goTo('GuideForum')}>
                <Icon name="compass" size={22} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>Guide Forum</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => goTo('FAQ')}>
                <Icon name="help-circle-outline" size={22} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>FAQ</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => goTo('About')}>
                <Icon name="information-outline" size={22} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>À propos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => goTo('Contact')}>
                <Icon name="phone" size={22} color="#8a348a" style={styles.menuIcon} />
                <Text style={styles.menuText}>Contactez-nous</Text>
              </TouchableOpacity>

              {/* Conditional Login/Logout Button */}
              {isLoggedIn ? (
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                  <Icon name="logout" size={22} color="#8a348a" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Déconnexion</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogin}>
                  <Icon name="login" size={22} color="#8a348a" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Connexion</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  iconContainer: { padding: 10 },
  logo: { width: 60, height: 40, marginBottom: 8 },

  modalRoot: { flex: 1, backgroundColor: 'transparent' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },

  sidebarMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 20,
  },
  sidebarInner: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },

  menuTop: { alignItems: 'center', marginBottom: 40 },
  menuTopUser: { marginTop: 6, color: '#8a348a', opacity: 0.7, fontSize: 13, maxWidth: 240 },
  menuTopLogo: { width: 100, height: 90, marginBottom: 8 },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#F2F3F5',
  },
  logoutItem: { marginTop: 10 },
  menuIcon: {},
  menuText: { fontSize: 14.5, color: '#8a348a', fontWeight: '600', marginLeft: 12 },
});

export default Header;