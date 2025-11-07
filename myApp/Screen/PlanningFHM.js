import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'expo-blur';
import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';

const PLANNING_DATA = [
  { time: "9h30 - 10h30", title: "Le Marché de l'Emploi en Afrique", type: "conférence", description: "Discussion sur les opportunités d'emploi et les tendances du marché dans les différents secteurs." },
  { time: "10h30 - 12h00", title: "Rédiger un CV Impactant", type: "atelier", description: "Un atelier pour améliorer vos CV et les adapter aux exigences du marché." },  
  { time: "17h00 - 18h00", title: "Clôture & Remerciements", type: "clôture", description: "Remerciements et clôture du Forum." },
];

const PlanningTimelinePremium = () => (
  <View style={styles.timelinePremiumContainer}>
    <LinearGradient
      colors={["#8a348a", "#c76b98"]}
      style={styles.timelinePremiumLineVertical}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    {PLANNING_DATA.map((ev, idx) => {
      const isLeft = idx % 2 === 0;
      const isConf = ev.type === 'conférence';
      const isAtelier = ev.type === 'atelier';
      return (
        <Animatable.View
          key={ev.time}
          animation={isLeft ? 'slideInLeft' : 'slideInRight'}
          delay={idx * 120}
          style={[styles.timelinePremiumRow, { flexDirection: isLeft ? 'row' : 'row-reverse', alignItems: 'center' }]}
        >
          {/* Badge horaire aligné */}
          <LinearGradient
            colors={["#8a348a", "#c76b98"]}
            style={[styles.timelinePremiumBadgeGlow, { marginHorizontal: 18 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.timelinePremiumBadgeTextBig} numberOfLines={1} adjustsFontSizeToFit>{ev.time.split(' - ')[0]}</Text>
          </LinearGradient>
          {/* Carte glassmorphism */}
          <View style={[styles.timelinePremiumCardWrap, { alignItems: isLeft ? 'flex-end' : 'flex-start' }]}> 
            <BlurView intensity={60} tint="light" style={styles.timelinePremiumGlassCard}>
              <View style={{ paddingTop: 18, paddingBottom: 8, paddingHorizontal: 8 }}>
                <Text style={styles.timelinePremiumTitle}>{ev.title}</Text>
                {(isConf || isAtelier) && (
                  <View style={[styles.timelineTypeBadge, isConf ? styles.timelineTypeConf : styles.timelineTypeAtelier]}>
                    <Text style={styles.timelineTypeBadgeText}>{isConf ? '🎤 Conférence' : '🛠️ Atelier'}</Text>
                  </View>
                )}
                <Text style={styles.timelinePremiumDesc}>{ev.description}</Text>
              </View>
            </BlurView>
          </View>
        </Animatable.View>
      );
    })}
  </View>
);

const PlanningFHM = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} />
      <ImageBackground
        source={require('../assets/BackGround.jpeg')}
        style={styles.background}
        imageStyle={{ opacity: 0.08 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <LinearGradient
            colors={['#8a348a', '#C76B98']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Planning Forum Horizons Maroc</Text>
          </LinearGradient>
          <Text style={styles.sectionTitle}></Text>
          <PlanningTimelinePremium />
        </ScrollView>
      </ImageBackground>
      <View style={styles.bottomNavContainer}>
        <BottomNavigationBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f8f6fc',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerGradient: {
    borderRadius: 18,
    marginBottom: 25,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8a348a',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  // Styles premium timeline (repris de HomeScreen.js)
  timelinePremiumContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 30,
    minHeight: 220,
    justifyContent: 'center',
    position: 'relative',
  },
  timelinePremiumLineVertical: {
    position: 'absolute',
    left: '50%',
    top: 0,
    width: 4,
    height: '100%',
    zIndex: 0,
    borderRadius: 2,
    transform: [{ translateX: -2 }],
  },
  timelinePremiumRow: {
    width: '100%',
    minHeight: 90,
    alignItems: 'center',
    marginVertical: 18,
    zIndex: 1,
    position: 'relative',
  },
  timelinePremiumCardWrap: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelinePremiumGlassCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 6,
    minWidth: 180,
    maxWidth: 260,
  },
  timelinePremiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 8,
    textAlign: 'left',
  },
  timelineTypeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginBottom: 8,
    marginTop: -2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  timelineTypeConf: {
    backgroundColor: '#8a348a',
  },
  timelineTypeAtelier: {
    backgroundColor: '#3a7bd5',
  },
  timelineTypeBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  timelinePremiumDesc: {
    fontSize: 15,
    color: '#444',
    marginTop: 2,
    marginBottom: 2,
    lineHeight: 21,
  },
  timelinePremiumBadgeGlow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  timelinePremiumBadgeTextBig: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
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
});

export default PlanningFHM; 