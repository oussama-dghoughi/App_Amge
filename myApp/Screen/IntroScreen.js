import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const IntroScreen = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoGlow = useRef(new Animated.Value(0.7)).current;
  const logoY = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  // Pulse + glow animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.12,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoGlow, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
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
    ).start();
  }, []);

  // Splash to intro transition
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoY, {
          toValue: -height * 0.23,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSplash(false);
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 9000,
        useNativeDriver: false,
      })
    ).start();
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bgInterpolate = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Halo, shine, pop
  const logoPop = useRef(new Animated.Value(0)).current;
  const logoHalo = useRef(new Animated.Value(0.5)).current;
  const shineAnim = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    Animated.spring(logoPop, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoHalo, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(logoHalo, { toValue: 0.5, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    Animated.timing(shineAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Badge animé
  const badgeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(badgeAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start();
  }, []);

  // Glow animé bouton
  const buttonGlow = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonGlow, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.timing(buttonGlow, { toValue: 0.7, duration: 900, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // Light sweep sur le titre
  const sweepAnim = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    Animated.timing(sweepAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Sparkle sur le badge
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(700),
      Animated.timing(sparkleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(sparkleAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1 }}>
      {/* Fond dégradé diagonal animé */}
      <Animated.View style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
        transform: [{ translateY: bgAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) }],
      }}>
        <LinearGradient
          colors={["#8a348a", "#2193b0", "#C76B98"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, width: '100%', height: '100%' }}
        />
        {/* Overlay blanc très doux */}
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.07)' }} />
      </Animated.View>
      <Animated.View
        style={{
          width: '90%',
          alignItems: 'center',
          opacity: contentAnim,
          transform: [
            { translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) },
          ],
          zIndex: 1,
          alignSelf: 'center',
          marginTop: 80,
        }}
      >
        {/* Logo FHM avec effet shine et pop */}
        <Animated.View style={{ width: 180, height: 180, marginBottom: 18, zIndex: 1, justifyContent: 'center', alignItems: 'center', transform: [{ scale: logoPop }] }}>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 180, height: 180, resizeMode: 'contain' }}
          />
          {/* Badge Paris 2024 animé + sparkle */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 10,
              right: -18,
              backgroundColor: '#fff',
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 4,
              shadowColor: '#8a348a',
              shadowOpacity: 0.18,
              shadowRadius: 6,
              elevation: 4,
              opacity: badgeAnim,
              transform: [{ scale: badgeAnim }],
            }}
          >
            <Text style={{ color: '#8a348a', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }}>Paris 2025</Text>
            {/* Sparkle animé */}
            <Animated.View
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                opacity: sparkleAnim,
                transform: [
                  { scale: sparkleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.2] }) },
                  { rotate: '20deg' },
                ],
              }}
            >
              <FontAwesome name="star" size={18} color="#f9d923" />
            </Animated.View>
          </Animated.View>
          {/* Effet shine */}
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 180,
              height: 180,
              opacity: 0.35,
              transform: [
                { translateX: shineAnim.interpolate({ inputRange: [-1, 1], outputRange: [-180, 180] }) },
                { rotate: '-20deg' },
              ],
              pointerEvents: 'none',
            }}
          >
            <LinearGradient
              colors={["#fff8", "#fff4", "#fff0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 60, height: 180, borderRadius: 30 }}
            />
          </Animated.View>
        </Animated.View>
        {/* Titre en dégradé + light sweep */}
        <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <MaskedView
            maskElement={<Text style={[styles.title, { backgroundColor: 'transparent' }]}>Forum Horizons Maroc</Text>}
          >
            <LinearGradient
              colors={["#2193b0", "#8a348a", "#C76B98", "#e94057"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 40 }}
            >
              <Text style={[styles.title, { opacity: 0 }]}>{'Forum Horizons Maroc'}</Text>
            </LinearGradient>
          </MaskedView>
          {/* Light sweep animé */}
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: 40,
              opacity: 0.25,
              transform: [
                { translateX: sweepAnim.interpolate({ inputRange: [-1, 1], outputRange: [-width * 0.7, width * 0.7] }) },
                { rotate: '10deg' },
              ],
              pointerEvents: 'none',
            }}
          >
            <LinearGradient
              colors={["#fff8", "#fff4", "#fff0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 80, height: 40, borderRadius: 20 }}
            />
          </Animated.View>
        </View>
        {/* Slogan */}
        <Animatable.Text animation="fadeInUp" delay={300} style={{ fontSize: 17, color: '#fff', fontWeight: '600', marginBottom: 10, textAlign: 'center', textShadowColor: '#8a348a33', textShadowRadius: 6 }}>
          Connecter les talents, bâtir l'avenir
        </Animatable.Text>
        <Text style={styles.subtitle}>Le plus grand forum de recrutement au Maroc</Text>
        {/* Stats glassy */}
        <BlurView intensity={30} tint="light" style={{ borderRadius: 18, padding: 10, flexDirection: 'row', gap: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)', marginBottom: 18, marginTop: 10 }}>
          <View style={styles.statItem}>
            <Ionicons name="school-outline" size={24} color="#8a348a" />
            <Text style={[styles.statNumber, { color: '#8a348a' }]}>100+</Text>
            <Text style={[styles.statLabel, { color: '#8a348a' }]}>Écoles</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="business-outline" size={24} color="#8a348a" />
            <Text style={[styles.statNumber, { color: '#8a348a' }]}>70+</Text>
            <Text style={[styles.statLabel, { color: '#8a348a' }]}>Entreprises</Text>
          </View>
        </BlurView>
        {/* Mini-icônes animées sous les stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginBottom: 18 }}>
          <Animatable.View animation="fadeInUp" delay={200} style={{ alignItems: 'center' }}>
            <FontAwesome name="users" size={26} color="#8a348a" />
            <Text style={{ fontSize: 12, color: '#8a348a', marginTop: 2 }}>Networking</Text>
          </Animatable.View>
          <Animatable.View animation="fadeInUp" delay={400} style={{ alignItems: 'center' }}>
            <FontAwesome name="lightbulb-o" size={26} color="#C76B98" />
            <Text style={{ fontSize: 12, color: '#C76B98', marginTop: 2 }}>Innovation</Text>
          </Animatable.View>
          <Animatable.View animation="fadeInUp" delay={600} style={{ alignItems: 'center' }}>
            <FontAwesome name="briefcase" size={26} color="#2193b0" />
            <Text style={{ fontSize: 12, color: '#2193b0', marginTop: 2 }}>Opportunités</Text>
          </Animatable.View>
        </View>
        {/* Bouton premium avec glow animé */}
        <Animated.View style={{ width: '80%', borderRadius: 25, overflow: 'hidden', elevation: 6, shadowColor: '#8a348a', shadowOpacity: buttonGlow, shadowRadius: 16, marginTop: 10 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ width: '100%', borderRadius: 25 }}
            onPress={() => navigation.replace('Login')}
            onPressIn={() => Animated.spring(logoPop, { toValue: 1.08, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(logoPop, { toValue: 1, useNativeDriver: true }).start()}
          >
            <LinearGradient
              colors={['#9575CD', '#7E57C2']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Commencer</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Animated.View>
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