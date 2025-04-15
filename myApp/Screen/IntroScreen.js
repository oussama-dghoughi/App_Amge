import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const IntroScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start(),
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleStart = async () => {
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7E57C2', '#B39DDB']}
        style={styles.gradient}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Logo animation */}
          <View style={styles.logoContainer}>
            <Animated.View style={[styles.circle, { transform: [{ rotate: spin }] }]}>
              <View style={styles.innerCircle}>
                <Ionicons name="globe-outline" size={80} color="#fff" />
              </View>
            </Animated.View>
          </View>

          {/* Title and description */}
          <Text style={styles.title}>Forum Horizon Maroc</Text>
          <Text style={styles.subtitle}>Le plus grand forum de recrutement au Maroc</Text>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="school-outline" size={24} color="#fff" />
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Écoles</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="business-outline" size={24} color="#fff" />
              <Text style={styles.statNumber}>200+</Text>
              <Text style={styles.statLabel}>Entreprises</Text>
            </View>
          </View>

          {/* Start button */}
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Commencer</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.9,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  innerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  button: {
    width: '80%',
    overflow: 'hidden',
    borderRadius: 25,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default IntroScreen; 