import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';

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
    punch: 'Un CV à jour, c\'est la base !',
  },
  {
    icon: 'account-voice',
    title: 'Prépare ton pitch',
    punch: 'Sois prêt à te présenter en 30s.',
  },
];

const GuideForumScreen = ({ navigation }) => {
  // Animations d'apparition
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  }, []);

  // Animation pour chaque étape
  const stepAnims = STEPS.map(() => useRef(new Animated.Value(0)).current);
  useEffect(() => {
    Animated.stagger(180, stepAnims.map(anim =>
      Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true })
    )).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7fb' }}>
      <Header navigation={navigation} />
      <LinearGradient
        colors={["#f7f7fb", "#f3e6fa", "#f7f7fb"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Bloc d'intro */}
        <Animated.View style={[styles.introBlock, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}> 
          <Text style={styles.introTitle}>Prépare ta réussite au Forum !</Text>
          <Text style={styles.introText}>Découvre les étapes clés pour maximiser ta participation et décrocher des opportunités.</Text>
        </Animated.View>

        {/* Bloc Conseil du jour */}
        <Animated.View style={[styles.tipBlock, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}> 
          <View style={styles.tipIconCircle}>
            <Icon name="lightbulb-on-outline" size={34} color="#fff" />
          </View>
          <Text style={styles.tipTitle}>Conseil du jour</Text>
          <Text style={styles.tipText}>
            Prépare une présentation courte et percutante de toi-même (le fameux "pitch").
            Entraîne-toi à te présenter en 30 secondes pour marquer les esprits dès le premier contact !
          </Text>
        </Animated.View>

        {/* Timeline verticale */}
        <View style={styles.timelineContainer}>
          <LinearGradient
            colors={["#8a348a", "#e94057"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.timelineLine}
          />
          {STEPS.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <Animated.View
                key={idx}
                style={[
                  styles.timelineRow,
                  { flexDirection: isLeft ? 'row' : 'row-reverse' },
                  { opacity: stepAnims[idx], transform: [{ translateY: stepAnims[idx].interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] },
                ]}
              >
                <View style={styles.timelineCardWrap}>
                  <View style={styles.timelineCard}>
                    <View style={styles.timelineIconCircle}>
                      <Icon name={step.icon} size={26} color="#fff" />
                    </View>
                    <Text style={styles.timelineTitle}>{step.title}</Text>
                    <Text style={styles.timelinePunch}>{step.punch}</Text>
                  </View>
                </View>
                <View style={styles.timelineDotWrap}>
                  <View style={styles.timelineDot} />
                </View>
              </Animated.View>
            );
          })}
        </View>

        {/* Bloc Le Jour J */}
        <Animated.View style={[styles.jourJBlock, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}> 
          <View style={styles.jourJIconCircle}>
            <Icon name="calendar-check" size={38} color="#fff" />
          </View>
          <Text style={styles.jourJTitle}>Le Jour J</Text>
          <Text style={styles.jourJText}>C'est ton moment, donne le meilleur de toi-même !</Text>
        </Animated.View>
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BottomNavigationBar navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  introBlock: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 18,
    paddingHorizontal: 18,
  },
  introTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 15.5,
    color: '#444',
    textAlign: 'center',
    marginBottom: 2,
  },
  tipBlock: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 22,
    marginHorizontal: 18,
    marginBottom: 32,
    alignItems: 'center',
    padding: 22,
    shadowColor: '#e94057',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  tipIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e94057',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#e94057',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#e94057',
    marginBottom: 6,
    textAlign: 'center',
  },
  tipText: {
    color: '#444',
    fontSize: 14.5,
    textAlign: 'center',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  timelineContainer: {
    marginVertical: 18,
    marginBottom: 36,
    alignItems: 'center',
    position: 'relative',
    minHeight: 320,
  },
  timelineLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    width: 4,
    height: '100%',
    zIndex: 0,
    borderRadius: 2,
    transform: [{ translateX: -2 }],
  },
  timelineRow: {
    width: '100%',
    minHeight: 90,
    alignItems: 'center',
    marginVertical: 18,
    zIndex: 1,
    position: 'relative',
    justifyContent: 'flex-start',
  },
  timelineCardWrap: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2,
    maxWidth: width * 0.7,
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  timelineIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e94057',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#e94057',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineTitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 4,
    textAlign: 'center',
  },
  timelinePunch: {
    color: '#444',
    fontSize: 13.5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timelineDotWrap: {
    width: 32,
    alignItems: 'center',
    zIndex: 3,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#e94057',
    marginVertical: 0,
    elevation: 2,
  },
  jourJBlock: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    paddingHorizontal: 18,
  },
  jourJIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#8a348a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#8a348a',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  jourJTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 6,
    textAlign: 'center',
  },
  jourJText: {
    color: '#444',
    fontSize: 14.5,
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default GuideForumScreen; 