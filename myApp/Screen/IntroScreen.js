import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const IntroScreen = ({ navigation }) => {
  useEffect(() => {
    const handleIntroComplete = async () => {
      try {
        // Mark that user has seen the intro
        await AsyncStorage.setItem('hasSeenIntro', 'true');
        
        // Check if user is logged in
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        
        // Navigate based on login status
        if (isLoggedIn === 'true') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      } catch (error) {
        console.error('Error in intro screen:', error);
        // Fallback to Home on error
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    };

    const timer = setTimeout(() => {
      handleIntroComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/BackGround.jpeg')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      {/* Overlay to keep text readable */}
      <View style={styles.overlay}>
        <Image
          source={require('../assets/Logo_2026.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.85, // subtle background
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 24,
  },
});

export default IntroScreen;