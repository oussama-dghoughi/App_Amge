import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const BottomNavigationBar = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      {/* Floating QR Button */}
      <View style={styles.qrButtonWrapper}>
        <TouchableOpacity style={styles.qrButton}>
          <View style={styles.qrButtonInner}>
            <Icon name="qrcode-scan" size={32} color="#9b59b6" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Navigation Bar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.iconContainer} 
          onPress={() => navigation.navigate('Home')}
        >
          <Feather name="home" size={26} color="#9b59b6" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => navigation.navigate('Plan')}
        >
          <Icon name="map-outline" size={28} color="#9b59b6" />
        </TouchableOpacity>

        {/* Empty space for the floating QR button */}
        <View style={styles.iconContainer} />

        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => navigation.navigate('Offres')}
        >
          <View style={styles.searchIconWrapper}>
            <Icon name="briefcase-search-outline" size={30} color="#9b59b6" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconContainer} 
          onPress={() => navigation.navigate('PlanningFHM')}
        >
          <Icon name="calendar-clock-outline" size={28} color="#9b59b6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Shadow for Android
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  qrButtonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    pointerEvents: 'box-none',
  },
  qrButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  qrButtonInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    zIndex: 1000,
    
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    
    // Shadow for Android
    elevation: 10,
  },
  searchIconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  searchOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
});

export default BottomNavigationBar;