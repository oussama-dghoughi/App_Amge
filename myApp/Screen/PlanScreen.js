import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HeaderMenu from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';

// Import platform-specific InteractiveMap
const InteractiveMapComponent = Platform.select({
  web: () => require('../components/PlanModule/InteractiveMap.web').default,
  default: () => require('../components/PlanModule/InteractiveMap.native').default,
})();

const PlanScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.mainContainer}>
        {/* ✅ Header with SafeAreaView */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeHeader}>
          <HeaderMenu navigation={navigation} />
        </SafeAreaView>

        {/* ✅ InteractiveMap content */}
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
          <View style={styles.mapContainer}>
            <InteractiveMapComponent navigation={navigation} />
          </View>

          {/* ✅ Bottom Navigation Bar */}
          <View style={styles.bottomNavContainer}>
            <BottomNavigationBar navigation={navigation} />
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ✅ Header safe area styling
  safeHeader: {
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
  },

  mapContainer: {
    flex: 1,
    paddingBottom: 30, // Space for bottom nav
  },

  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default PlanScreen;