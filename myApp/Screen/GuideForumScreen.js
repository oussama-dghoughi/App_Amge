import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    icon: 'target',
    title: 'Cible ta boîte',
    punch: 'Vise les entreprises qui \nte font rêver !',
  },
  {
    icon: 'magnify',
    title: 'Renseigne-toi',
    punch: 'Vise les entreprises\nqui te font rêver !',
  },
  {
    icon: 'file-account',
    title: 'Prépare ton CV',
    punch: 'Un CV à jour, \nc\'est la base !',
  },
  {
    icon: 'account-voice',
    title: 'Prépare ton pitch',
    punch: 'Sois prêt à te présenter\nen 30s.',
  },
  {
    icon: 'calendar-star',
    title: 'Le jour J',
    punch: 'C\'est ton moment, donne\nle meilleur de toi-même !',
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
        <View style={styles.headerWrapper}>
          <Header navigation={navigation} />
        </View>
      </SafeAreaView>
      <ImageBackground
        source={require('../assets/BackGround.jpeg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.5 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 90, paddingHorizontal: 20 }}>
          {/* Header avec flèche retour + titre */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={24} color="#8E4DA6" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Guide Forum</Text>
          </View>


          {/* NOUVELLE TIMELINE */}
          <View style={styles.newTimelineContainer}>
            {/* Demi-cercle pointillé SVG */}
            <Svg
              height="430"
              width="430"
              style={{ position: 'absolute', left: -280, top: '6%', zIndex: 0 }}
            >
              <Circle
                cx="215"
                cy="215"
                r="212"
                stroke="#26C6DA"
                strokeWidth="4"
                strokeDasharray="10, 10"
                fill="none"
              />
            </Svg>


            {STEPS.map((step, index) => {
              // Positions précalculées pour suivre l'arc du cercle
              const positions = [
                { top: 35, left: 8 },   // Cible ta boîte (haut)
                { top: 110, left: 80 },  // Renseigne-toi
                { top: 215, left: 110 },  // Prépare ton CV (milieu)
                { top: 322, left: 80 },  // Prépare ton pitch
                { top: 400, left: 8 },  // Le jour J (bas)
              ];

              return (
                <View
                  key={index}
                  style={[
                    styles.stepRow,
                    {
                      position: 'absolute',
                      top: positions[index].top,
                      left: positions[index].left,
                    }
                  ]}
                >
                  {/* Grand cercle avec gradient */}
                  <LinearGradient
                    colors={['#5E35B1', '#26C6DA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.stepCircle}
                  >
                    <Icon name={step.icon} size={28} color="#fff" />
                  </LinearGradient>

                  {/* Texte à droite */}
                  <View style={styles.stepTextContainer}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.punch}</Text>
                  </View>
                </View>
              );
            })}

          </View>

        </ScrollView>

        <View style={styles.bottomNavContainer}>
          <BottomNavigationBar navigation={navigation} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaHeader: {
    backgroundColor: '#fff',
  },
  headerWrapper: {
    backgroundColor: '#fff',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 5,
    marginBottom: 15,
  },
  backButton: {
    padding: 5,
    marginBottom: 2,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8E4DA6',
    marginBottom: 5,
  },
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
  newTimelineContainer: {
    flex: 1,
    marginTop: 20,
    paddingBottom: 40,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 600,
  },
  dashedLine: {
    position: 'absolute',
    left: -200,
    top: '10%',
    width: 400,
    height: 400,
    borderRadius: 200,
    borderWidth: 4,
    borderColor: '#26C6DA',
    borderStyle: 'dashed',
    zIndex: 0,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  stepTextContainer: {
    flex: 1,
    marginLeft: 12,
    flexWrap: 'wrap',
    maxWidth: 250,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8E4DA6',
    marginBottom: 0,
  },
  stepDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
    flexWrap: 'wrap',
    flexShrink: 1,
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