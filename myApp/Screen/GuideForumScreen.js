import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    icon: 'target',
    title: 'Cible ta boîte',
    punch: 'Vise les entreprises qui te font rêver !',
  },
  {
    icon: 'magnify',
    title: 'Renseigne-toi',
    punch: 'Sois incollable sur leurs actus.',
  },
  {
    icon: 'file-account',
    title: 'Prépare ton CV',
    punch: 'Un CV à jour, c est la base !',
  },
  {
    icon: 'account-voice',
    title: 'Prépare ton pitch',
    punch: 'Sois prêt à te présenter en 30s.',
  },
];

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const GuideForumScreen = () => {
  // Animation de fond (particules/lumière)
  const bgAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  const bgOpacity = bgAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.18, 0.32, 0.18] });
  const bgScale = bgAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });

  // Animation pop pour les étapes
  const stepScales = STEPS.map(() => useRef(new Animated.Value(0.5)).current);
  useEffect(() => {
    Animated.stagger(180, stepScales.map((anim) =>
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 5 })
    )).start();
  }, []);

  // Animation pulse pour l'icône calendrier
  const calPulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(calPulse, { toValue: 1.18, duration: 600, useNativeDriver: true }),
        Animated.timing(calPulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Animation confetti (simple, points qui tombent)
  const confettiY = useRef(new Animated.Value(-40)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(confettiY, {
        toValue: 80,
        duration: 1800,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      {/* Effet de lumière animée en fond */}
      <Animated.View style={{
        position: 'absolute',
        top: -80,
        left: width * 0.1,
        width: width * 0.8,
        height: 220,
        borderRadius: 120,
        backgroundColor: '#e94057',
        opacity: bgOpacity,
        transform: [{ scale: bgScale }],
        zIndex: 0,
      }} />
      {/* Confetti simple */}
      <Animated.View style={{
        position: 'absolute',
        left: width * 0.5 - 10,
        top: 60,
        zIndex: 2,
        transform: [{ translateY: confettiY }],
      }}>
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#8a348a', opacity: 0.18 }} />
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#e94057', marginTop: 8, opacity: 0.22 }} />
      </Animated.View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40, zIndex: 1 }}>
        {/* Bloc CV ultra-court */}
        <View style={styles.cvBlock}>
          <AnimatedIcon name="file-account" size={60} color="#8a348a" style={{ marginBottom: 10, transform: [{ scale: stepScales[2] }] }} />
          <Text style={styles.gradientTitle}>Dépose ton CV</Text>
          <Text style={styles.punch}>Un seul clic, et c'est envoyé !</Text>
        </View>
        {/* Timeline ultra-visuelle */}
        <View style={styles.timelineBlock}>
          <Text style={styles.gradientTitle}>Prépare-toi en 4 étapes</Text>
          <View style={styles.timelineRow}>
            {STEPS.map((step, idx) => (
              <Animated.View key={idx} style={{
                alignItems: 'center',
                marginHorizontal: 6,
                transform: [{ scale: stepScales[idx] }],
              }}>
                <TouchableOpacity activeOpacity={0.8} style={styles.timelineCircle}>
                  <AnimatedIcon name={step.icon} size={28} color="#fff" style={{ transform: [{ scale: stepScales[idx] }] }} />
                </TouchableOpacity>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.punch}>{step.punch}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
        {/* Bloc Le Jour J ultra-court */}
        <View style={styles.jourJBlock}>
          <AnimatedIcon name="calendar-check" size={60} color="#8a348a" style={{ marginBottom: 10, transform: [{ scale: calPulse }] }} />
          <Text style={styles.gradientTitle}>Le Jour J</Text>
          <Text style={styles.punch}>C'est ton moment !</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cvBlock: {
    backgroundColor: '#f1f1f3',
    alignItems: 'center',
    padding: 24,
    borderRadius: 18,
    margin: 18,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  gradientTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 1.2,
    marginBottom: 10,
    color: '#8a348a',
  },
  stepTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#e94057',
    textAlign: 'center',
    marginBottom: 2,
  },
  punch: {
    color: '#444',
    fontSize: 13.5,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  timelineBlock: {
    marginHorizontal: 10,
    marginBottom: 30,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: 2,
    marginTop: 10,
  },
  timelineCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e94057',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#e94057',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  jourJBlock: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
});

export default GuideForumScreen; 