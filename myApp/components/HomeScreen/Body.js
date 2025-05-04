import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const EVENT_DATE = new Date('2025-06-01T00:00:00').getTime();

const FlipNumber = ({ value, label }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
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
      ),
    ]).start();
  }, [value]);

  const getIcon = () => {
    switch (label) {
      case 'JOURS':
        return 'calendar';
      case 'HEURES':
        return 'clock-o';
      case 'MINUTES':
        return 'hourglass-half';
      case 'SECONDES':
        return 'hourglass-end';
      default:
        return 'clock-o';
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.flipContainer, 
        { 
          transform: [
            { scale: pulseAnim },
            { perspective: 1000 },
          ] 
        }
      ]}
    >
      <BlurView intensity={90} tint="light" style={styles.flipBlur}>
        <LinearGradient
          colors={['#8a348a', '#C76B98']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.flipGradient}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon name={getIcon()} size={28} color="#fff" style={styles.flipIcon} />
          </Animated.View>
          <Animated.View
            style={{
              transform: [
                { perspective: 1000 },
                { rotateX: flipAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ['0deg', '-90deg', '0deg'],
                })},
              ],
            }}
          >
            <Text style={styles.flipNumber}>{String(value).padStart(2, '0')}</Text>
          </Animated.View>
          <Text style={styles.flipLabel}>{label}</Text>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
};

const Body = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // État pour le carrousel d'images
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const images = [
    require('../../assets/image1.jpeg'),
    require('../../assets/image2.png'),
    require('../../assets/image3.png'),
  ];

  const animateImageTransition = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = EVENT_DATE - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    const imageInterval = setInterval(() => {
      animateImageTransition();
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(imageInterval);
    };
  }, []);

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === currentIndex ? '#8a348a' : 'rgba(138, 52, 138, 0.3)',
                width: index === currentIndex ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        {/* Titre animé */}
        <Animatable.View animation="fadeInDown" duration={1500} style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Forum Horizon Maroc</Text>
          <Text style={styles.subTitle}>L'événement qui façonnera votre avenir professionnel</Text>
        </Animatable.View>

        {/* Compte à rebours */}
        <View style={styles.countdownContainer}>
          <FlipNumber value={timeLeft.days} label="JOURS" />
          <FlipNumber value={timeLeft.hours} label="HEURES" />
          <FlipNumber value={timeLeft.minutes} label="MINUTES" />
          <FlipNumber value={timeLeft.seconds} label="SECONDEs" />
        </View>

        {/* Message d'accroche */}
        <Animatable.View animation="fadeInUp" delay={500} duration={1500} style={styles.ctaContainer}>
          <Text style={styles.ctaText}>
            🌟 Ne manquez pas cette opportunité unique !
          </Text>
          <Text style={styles.ctaDescription}>
            Rejoignez plus de 2000 étudiants et 60 entreprises pour façonner l'avenir de l'ingénierie au Maroc
          </Text>
          
          <TouchableOpacity style={styles.registerButton}>
            <LinearGradient
              colors={['#8a348a', '#C76B98']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Je m'inscris maintenant</Text>
              <Icon name="arrow-right" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <Animatable.View animation="fadeInLeft" delay={800} style={styles.statItem}>
            <Icon name="users" size={32} color="#8a348a" />
            <Text style={styles.statNumber}>2200+</Text>
            <Text style={styles.statLabel}>Visiteurs</Text>
          </Animatable.View>
          
          <Animatable.View animation="fadeInUp" delay={1000} style={styles.statItem}>
            <Icon name="building" size={32} color="#8a348a" />
            <Text style={styles.statNumber}>60+</Text>
            <Text style={styles.statLabel}>Entreprises</Text>
          </Animatable.View>
          
          <Animatable.View animation="fadeInRight" delay={1200} style={styles.statItem}>
            <Icon name="map-marker" size={32} color="#8a348a" />
            <Text style={styles.statNumber}>5000</Text>
            <Text style={styles.statLabel}>m² surface</Text>
          </Animatable.View>
        </View>

        {/* Carrousel d'images */}
        <View style={styles.imageBoxContainer}>
          <BlurView intensity={20} tint="light" style={styles.imageBlurContainer}>
            <LinearGradient
              colors={['rgba(138, 52, 138, 0.1)', 'rgba(161, 60, 161, 0.1)']}
              style={styles.imageGradient}
            >
              <Animated.View
                style={[
                  styles.imageAnimatedContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <Image
                  source={images[currentIndex]}
                  style={styles.imageBox}
                  resizeMode="cover"
                />
              </Animated.View>
              {renderPaginationDots()}
            </LinearGradient>
          </BlurView>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8a348a',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginBottom: 30,
    gap: 6,
  },
  flipContainer: {
    marginHorizontal: 2,
    marginVertical: 0,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minWidth: 64,
  },
  flipBlur: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  flipGradient: {
    width: 90,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
  },
  flipIcon: {
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  flipNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  flipLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ctaContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  ctaText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8a348a',
    textAlign: 'center',
    marginBottom: 15,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  registerButton: {
    width: width * 0.8,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minWidth: width * 0.28,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8a348a',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  imageBoxContainer: {
    marginTop: 10,
    marginBottom: 20,
    width: width * 0.9,
    height: 200,
    alignSelf: 'center',
  },
  imageBlurContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageGradient: {
    flex: 1,
    padding: 8,
  },
  imageAnimatedContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageBox: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Body;