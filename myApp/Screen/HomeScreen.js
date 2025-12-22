import React from 'react';
import { View, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/HomeScreen/Header';
import Body from '../components/HomeScreen/Body';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>

        {/* ✅ WHITE system status bar */}
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ImageBackground
          source={require('../assets/BackGround.jpeg')}
          style={styles.bodyBackground}
          imageStyle={{ opacity: 0.85 }}
        >

        {/* ================= HEADER (WHITE) ================= */}
        <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
          <View style={styles.headerWrapper}>
            <Header navigation={navigation} />
          </View>
        </SafeAreaView>

        {/* ================= BODY WITH BACKGROUND IMAGE ================= */}
        
          <Body />
        </ImageBackground>

        {/* ================= BOTTOM NAV (WHITE) ================= */}
        <View style={styles.bottomNavContainer}>
          <BottomNavigationBar navigation={navigation} />
        </View>

      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* ---------- HEADER ---------- */
  safeAreaHeader: {
    backgroundColor: '#fff',
  },
  headerWrapper: {
    backgroundColor: '#fff',
  },

  /* ---------- BODY ---------- */
  bodyBackground: {
    flex: 1,
  },

  /* ---------- BOTTOM NAV ---------- */
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default HomeScreen;
