import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground, TouchableOpacity, Image, Animated, Dimensions, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

// Composant pour chaque chiffre du compte à rebours
const CountdownDigit = ({ value, label }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 20,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <BlurView intensity={80} tint="light" style={styles.digitContainer}>
      <LinearGradient
        colors={['rgba(138, 52, 138, 0.8)', 'rgba(161, 60, 161, 0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.digitGradient}
      >
        <Animated.View
          style={[
            styles.digitValue,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.digitText}>{String(value).padStart(2, '0')}</Text>
        </Animated.View>
        <View style={styles.labelContainer}>
          <Text style={styles.digitLabel}>{label}</Text>
        </View>
      </LinearGradient>
    </BlurView>
  );
};

const FlipNumber = ({ value, label }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);

  useEffect(() => {
    if (value !== displayValue) {
      setNextValue(value);
      Animated.parallel([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        flipAnim.setValue(0);
        setDisplayValue(value);
      });
    }
  }, [value]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <View style={styles.flipContainer}>
      <BlurView intensity={40} tint="light" style={styles.flipBlurContainer}>
        <LinearGradient
          colors={['rgba(138, 52, 138, 0.95)', 'rgba(161, 60, 161, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.flipGradient}
        >
          <View style={styles.flipInnerContainer}>
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: glowOpacity,
                },
              ]}
            />
            <View style={styles.flipTop}>
              <Text style={styles.flipNumber}>{String(displayValue).padStart(2, '0')}</Text>
            </View>
            <View style={styles.flipDivider} />
            <View style={styles.flipBottom}>
              <Text style={styles.flipNumber}>{String(displayValue).padStart(2, '0')}</Text>
            </View>
            <Animated.View
              style={[
                styles.flipCard,
                {
                  transform: [{ rotateX: frontInterpolate }],
                },
              ]}
            >
              <Text style={styles.flipNumber}>{String(displayValue).padStart(2, '0')}</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.flipCardBack,
                {
                  transform: [{ rotateX: backInterpolate }],
                },
              ]}
            >
              <Text style={styles.flipNumber}>{String(nextValue).padStart(2, '0')}</Text>
            </Animated.View>
          </View>
        </LinearGradient>
      </BlurView>
      <LinearGradient
        colors={['rgba(138, 52, 138, 0.8)', 'rgba(161, 60, 161, 0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.labelGradient}
      >
        <Text style={styles.flipLabel}>{label}</Text>
      </LinearGradient>
    </View>
  );
};

const StatCard = ({ number, label, icon, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 200),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          tension: 20,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCardContainer,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <BlurView intensity={60} tint="light" style={styles.statCardBlur}>
        <LinearGradient
          colors={['rgba(138, 52, 138, 0.9)', 'rgba(161, 60, 161, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCardGradient}
        >
          <View style={styles.statIconContainer}>
            <Icon name={icon} size={24} color="#fff" style={styles.statIcon} />
          </View>
          <Text style={styles.statCardNumber}>{number}</Text>
          <Text style={styles.statCardLabel}>{label}</Text>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
};

const Body = () => {
  const [timeLeft, setTimeLeft] = useState(360000);
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const buttonPressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Animation continue du bouton
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPressAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPressAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const days = Math.floor(time / (3600 * 24));
    const hours = Math.floor((time % (3600 * 24)) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const buttonAnimatedStyle = {
    transform: [
      { scale: buttonScaleAnim },
      {
        translateY: buttonPressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  // Image Carousel (Slide Images every 5 seconds)
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    require('../../assets/image1.jpeg'),
    require('../../assets/image1.png'),
    require('../../assets/image2.png'),
    require('../../assets/image3.png'), // Add more images here
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
    const intervalId = setInterval(() => {
      animateImageTransition();
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
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
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        {/* StatusBar */}
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        {/* Main Text */}
        <Text style={styles.mainText}>Forum Horizons Maroc 2025</Text>

        {/* Countdown Timer */}
        <View style={styles.countdownContainer}>
          <FlipNumber value={days} label="JOURS" />
          <FlipNumber value={hours} label="HEURES" />
        </View>

        {/* Inscrivez-vous Button */}
        <Animated.View style={[styles.registerButtonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity
            onPress={handleButtonPress}
            activeOpacity={0.7}
          >
            <BlurView intensity={90} tint="light" style={styles.registerButton}>
              <LinearGradient
                colors={['rgba(138, 52, 138, 0.9)', 'rgba(255, 107, 139, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.registerGradient}
              >
                <Text style={styles.registerButtonText}>Inscrivez-vous</Text>
                <View style={styles.buttonGlow} />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Image Box with Slideshow */}
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

        {/* Statistics Section */}
        <View style={styles.statisticsContainer}>
          <StatCard
            number="+2200"
            label="Visiteurs"
            icon="users"
            index={0}
          />
          <StatCard
            number="+60"
            label="Entreprises"
            icon="building"
            index={1}
          />
          <StatCard
            number="+5000 m²"
            label="Surface"
            icon="map-marker"
            index={2}
          />
        </View>

        {/* Social Media Sidebar */}
        <View style={styles.socialSidebar}>
          <BlurView intensity={60} tint="light" style={styles.socialBlur}>
            <LinearGradient
              colors={['rgba(138, 52, 138, 0.95)', 'rgba(161, 60, 161, 0.95)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.socialGradient}
            >
              {['instagram', 'facebook', 'linkedin', 'envelope'].map((icon, index) => (
                <TouchableOpacity 
                  key={icon}
                  style={styles.socialIconButton}
                  onPress={() => console.log(`${icon} pressed`)}
                >
                  <Animated.View
                    style={[
                      styles.iconContainer,
                      {
                        transform: [{
                          scale: buttonScaleAnim
                        }]
                      }
                    ]}
                  >
                    <Icon name={icon} size={18} color="#fff" />
                  </Animated.View>
                </TouchableOpacity>
              ))}
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
  mainText: {
    color: '#8a348a',
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 5,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  flipContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  flipBlurContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  flipGradient: {
    borderRadius: 12,
    padding: 1.5,
  },
  flipInnerContainer: {
    width: 60,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 3,
  },
  flipTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  flipBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  flipDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    top: '50%',
    marginTop: -0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 2,
  },
  flipCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    backfaceVisibility: 'hidden',
    transformOrigin: 'bottom',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  flipCardBack: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backfaceVisibility: 'hidden',
    transformOrigin: 'top',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  flipNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  labelGradient: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  flipLabel: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  registerButtonContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  registerButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  registerGradient: {
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
  },
  imageBoxContainer: {
    marginTop: 30,
    width: width * 0.85,
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
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
    gap: 12,
  },
  statCardContainer: {
    flex: 1,
    maxWidth: 110,
    aspectRatio: 0.8,
  },
  statCardBlur: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statCardGradient: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statCardNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statCardLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  socialSidebar: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -100 }],
    width: 50,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  socialBlur: {
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  socialGradient: {
    padding: 10,
    alignItems: 'center',
  },
  socialIconButton: {
    width: 40,
    height: 40,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    transition: '0.3s',
  },
});

export default Body;