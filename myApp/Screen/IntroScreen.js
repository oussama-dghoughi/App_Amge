import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const IntroScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        setTimeout(() => {
          if (userToken) {
            navigation.replace('Home');
          } else {
            navigation.replace('Login');
          }
        }, 3000); // Reduced delay slightly for better UX
      } catch (e) {
        console.error(e);
        navigation.replace('Login');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Forum Horizons Maroc</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8a348a',
    textAlign: 'center',
    letterSpacing: 1.2,
  },
});

export default IntroScreen; 