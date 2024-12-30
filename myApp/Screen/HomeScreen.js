import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground, TouchableOpacity, Image, ScrollView } from 'react-native';import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header.js'; // Ensure the path to Header is correct
import BottomNavigationBar from '../components/BottomNavigationBar'; // Import the BottomNavigationBar component
import Body from '../components/Body';
import Icon from 'react-native-vector-icons/FontAwesome';
const HomeScreen = () => {
  const handleMenuPress = () => {
    console.log('Menu button pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile button pressed');
  };

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../assets/BackGround.jpeg')} // Keeping the background image
        style={styles.background}
        imageStyle={{ opacity: 0.3 }} // Adjust opacity as needed
      >
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
          {/* StatusBar */}
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />

          {/* Header */}
          <View style={styles.headerContainer}>
            <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress} />
          </View>

          {/* Body (Content inside ScrollView to avoid overflow issues) */}
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
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    // Optionally set height for the header, if not already defined inside Header component
    height: 80, // Set to the height of your Header component
  },
  bodyContainer: {
    flexGrow: 1, // Allow the body to take available space
    paddingBottom: 60, // Padding to ensure it doesn't overlap with the bottom navigation bar
    paddingTop: 20, // Padding from the top to avoid overlap with header
  },
});


export default HomeScreen;
