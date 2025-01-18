import React from 'react';
import { View, StyleSheet, StatusBar, ImageBackground, ScrollView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import Body from '../components/HomeScreen/Body';

const HomeScreen = () => {
  const handleMenuPress = () => {
    console.log('Menu button pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile button pressed');
  };

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
});

export default HomeScreen;
