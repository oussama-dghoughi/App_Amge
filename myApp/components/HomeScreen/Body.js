import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');
const EVENT_DATE = new Date('2026-06-01T00:00:00').getTime();

/** ✅ Cards data */
const POURQUOI_DATA = [
  {
    title: 'Networking',
    icon: 'account-group-outline',
    short: 'Développez votre réseau avec des acteurs majeurs.',
    content:
      "C'est l'occasion rêvée pour échanger avec de nombreux acteurs du tissu économique : grands groupes, PME et startups.\n\nSi vous êtes en recherche active d'un emploi ou d'un stage, c'est l'endroit idéal !\n\nLes recruteurs reçoivent souvent des candidatures par mail, mais rien ne vaut un dépôt de CV physique. Pensez à venir avec le vôtre pour le transmettre directement aux recruteurs.\n\nMême si vous ne comptez pas quitter votre emploi actuel, il est toujours utile de développer son réseau. Ne ratez pas cette opportunité !",
  },
  {
    title: 'Développement de\ncarrière',
    icon: 'rocket-launch-outline',
    short: 'Rencontrez les meilleures entreprises marocaines et internationales.',
    content:
      "Venez à la rencontre des meilleures entreprises marocaines et multinationales.\n\nÉtudiants, jeunes diplômés ou expérimentés, intéressés par un emploi en Afrique ou curieux du marché de l'emploi africain : Notre Forum est fait pour vous !\n\nÀ la clé : CDI, stages et beaucoup d'échanges. Même ceux qui ne recherchent pas d'emploi y trouveront leur bonheur.\n\nTout au long de la journée, des conférences de qualité seront tenues avec des invités prestigieux.",
  },
  {
    title: 'Conférences\ninspirantes',
    icon: 'presentation',
    short: 'Des conférences et ateliers pour tous les goûts.',
    content:
      "Les conférences organisées ne seront pas axées sur un seul thème.\n\nVous aurez un vaste choix :\n- Des ateliers d'entreprises pour découvrir les plus grands groupes africains.\n- Des conférences sur le développement personnel au travail.\n- Des discussions sur l'actualité économique du continent.\n\nY'en aura pour tous les goûts !",
  },
  {
    title: 'Opportunités\nprofessionnelles',
    icon: 'handshake-outline',
    short: 'Affinez votre projet professionnel avec des experts.',
    content:
      "Quel que soit votre parcours ou formation, nos prestigieux exposants seront toujours disponibles pour :\n- Vous parler des postes proposés et des compétences recherchées.\n- Vous présenter leur entreprise et leurs attentes.\n\nCes échanges vous aideront à :\n- Construire votre propre opinion\n- Affiner votre projet professionnel\n\nCes professionnels sauront vous aiguiller mieux que quiconque.",
  },
];

const MEDIA_DATA = [
  {
    logo: require('../../assets/medi1.png'),
    title: 'منتدى آفاق المغرب.. أو طريق العودة إلى الوطن',
    excerpt:
      'من الطلاب المغاربة إلى بلدان أوروبية منها فرنسا لإتمام دراستهم أو البحث عن عمل بعد الحصول على شهادات تؤهلهم ...',
    url: 'https://www.medi1.com/ar/episode/198031/%D9%85%D9%86%D8%AA%D8%AF%D9%89-%D8%A2%D9%81%D8%A7%D9%82-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8.-%D8%A3%D9%88-%D8%B7%D8%B1%D9%8A%D9%82-%D8%A7%D9%84%D8%B9%D9%88%D8%AF%D8%A9-%D8%A5%D9%84%D9%89-%D8%A7%D9%84%D9%88%D8%B7%D9%86',
  },
  {
    logo: require('../../assets/snrt.png'),
    title: "Le Forum Horizons Maroc, invité de la SNRT",
    excerpt: "Invité de l'émission matinale « Sbah Bladi », Ahmed Belghiti...",
    url: 'https://soundcloud.com/hassan-yazane-965217114/intervention-snrt-forum-horizons-maroc',
  },
  {
    logo: require('../../assets/map.png'),
    title:
      "Le Forum Horizons Maroc revient fin mai à Paris avec une nouvelle édition tournée vers l'Afrique",
    excerpt:
      'Paris - Après une édition 100% digitale en 2021 à cause de la pandémie mondiale du Covid-19, le Forum Horizons Maroc...',
    url: 'https://www.mapexpress.ma/actualite/economie-et-finance/forum-horizons-maroc-revient-fin-mai-paris-nouvelle-edition-tournee-vers-lafrique/',
  },
];

/** ===== FlipNumber ===== */
const FlipNumber = ({ value, label }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulseAnim]);

  const getIcon = () => {
    switch (label) {
      case 'Jours':
        return 'calendar';
      case 'Heures':
        return 'clock-o';
      case 'Minutes':
        return 'hourglass-half';
      case 'Secondes':
        return 'circle-o';
      default:
        return 'clock-o';
    }
  };

  const getGradientColors = () => {
    switch (label) {
      case 'Jours':
        return ['#7c4dbd', '#5a6fb8'];
      case 'Heures':
        return ['#4da8c7', '#7c4dbd'];
      case 'Minutes':
        return ['#5a6fb8', '#7c4dbd'];
      case 'Secondes':
        return ['#4da8c7', '#5a6fb8'];
      default:
        return ['#7c4dbd', '#5a6fb8'];
    }
  };

  return (
    <Animated.View style={[styles.flipContainer, { transform: [{ scale: pulseAnim }] }]}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.flipGradient}
      >
        <Text style={styles.flipNumber}>{String(value).padStart(2, '0')}</Text>
        <Icon name={getIcon()} size={28} color="#fff" style={styles.flipIcon} />
        <Text style={styles.flipLabel}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

/** ===== MediaCards ===== */
const MediaCards = () => {
  return (
    <View style={styles.mediaContainer}>
      {MEDIA_DATA.map((m, idx) => (
        <Animatable.View
          key={`${m.title}-${idx}`}
          animation="fadeInUp"
          delay={idx * 120}
          style={styles.mediaCard}
        >
          <View style={styles.mediaLogoWrap}>
            <View style={styles.mediaLogoCircle} />
            <View style={styles.mediaLogoInner}>
              <Animated.Image source={m.logo} style={styles.mediaLogo} resizeMode="contain" />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.mediaTitle} numberOfLines={2}>
              {m.title}
            </Text>
            <Text style={styles.mediaExcerpt} numberOfLines={3}>
              {m.excerpt}
            </Text>

            <TouchableOpacity
              style={styles.mediaBtn}
              activeOpacity={0.85}
              onPress={() => Linking.openURL(m.url)}
            >
              <Text style={styles.mediaBtnText}>Lire la suite</Text>
              <Icon name="chevron-right" size={16} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      ))}
    </View>
  );
};

/** ===== Footer ===== */
const Footer = () => (
  <View style={styles.footerContainer}>
    <Text style={styles.footerText}>© Forum Horizons Maroc 2026. Tous droits réservés.</Text>

    <View style={styles.footerSocials}>
      <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/forumhorizonsmaroc')}>
        <Icon name="facebook-square" size={28} color="#4267B2" style={styles.footerIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => Linking.openURL('https://linkedin.com/company/forum-horizons-maroc')}
      >
        <Icon name="linkedin-square" size={28} color="#0077B5" style={styles.footerIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com/forumhorizonsmaroc')}>
        <Icon name="instagram" size={28} color="#C13584" style={styles.footerIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/forumhorizonsma')}>
        <Icon name="twitter" size={28} color="#1DA1F2" style={styles.footerIcon} />
      </TouchableOpacity>
    </View>
  </View>
);

/** ===== Body ===== */
const Body = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [whyModal, setWhyModal] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = EVENT_DATE - now;

      setTimeLeft({
        days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        minutes: Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
        seconds: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000)),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Title */}
      <Animatable.View animation="fadeInDown" duration={1200} style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Forum Horizons Maroc</Text>
        <Text style={styles.subTitle}>
          Découvrez les opportunités d'avenir et{'\n'}connectez-vous avec les leaders de demain.
        </Text>
      </Animatable.View>

      {/* Countdown */}
      <View style={styles.countdownContainer}>
        <FlipNumber value={timeLeft.days} label="Jours" />
        <FlipNumber value={timeLeft.hours} label="Heures" />
        <FlipNumber value={timeLeft.minutes} label="Minutes" />
        <FlipNumber value={timeLeft.seconds} label="Secondes" />
      </View>

      {/* CTA */}
      <Animatable.View animation="fadeInUp" delay={400} duration={1200} style={styles.ctaContainer}>
        <Text style={styles.ctaText}>Ne manquez pas cette opportunité unique ! ⭐</Text>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => Linking.openURL('https://www.forumhorizonsmaroc.com/candidats/inscription')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#9b59b6', '#4da8c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Je m'inscris maintenant</Text>
            <Icon name="chevron-right" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      {/* Stats */}
      <Text style={styles.statsTitle}>Statistiques Clés</Text>

      <View style={styles.statsContainer}>
        <Animatable.View animation="fadeInLeft" delay={600} style={styles.statItem}>
          <Text style={styles.statNumber}>4000+</Text>
          <MaterialCommunityIcons name="account-group" size={36} color="#9b59b6" />
          <Text style={styles.statLabel}>Visiteurs</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={800} style={styles.statItem}>
          <Text style={styles.statNumber}>60+</Text>
          <Icon name="building" size={36} color="#9b59b6" />
          <Text style={styles.statLabel}>Entreprises</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInRight" delay={1000} style={styles.statItem}>
          <Text style={styles.statNumber}>5000</Text>
          <MaterialCommunityIcons name="map-marker" size={36} color="#9b59b6" />
          <Text style={styles.statLabel}>m² surface</Text>
        </Animatable.View>
      </View>

      {/* Pourquoi venir */}
      <Animatable.View animation="fadeIn" delay={1200} style={styles.whySection}>
        <Text style={styles.whySectionTitle}>
          Pourquoi venir au Forum{'\n'}Horizons Maroc ?
        </Text>

        <View style={styles.whyGrid}>
          {POURQUOI_DATA.map((item) => (
            <View key={item.title} style={styles.whyCard}>
              <View style={styles.whyIconWrapper}>
                <MaterialCommunityIcons name={item.icon} size={46} color="#9b59b6" />
              </View>

              <Text style={styles.whyCardTitle}>{item.title}</Text>

              <Text style={styles.whyCardDescription} numberOfLines={3}>
                {item.short}
              </Text>

              <TouchableOpacity
                style={styles.whyMoreBtn}
                activeOpacity={0.8}
                onPress={() => setWhyModal(item)}
              >
                <Text style={styles.whyMoreText}>En savoir plus</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Animatable.View>

      {/* Modal detail */}
      <Modal
        visible={!!whyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setWhyModal(null)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View animation="zoomIn" duration={250} style={styles.modalCard}>
            <LinearGradient
              colors={['#9b59b6', '#c76b98']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <View style={styles.modalTitleRow}>
                {whyModal?.icon ? (
                  <MaterialCommunityIcons
                    name={whyModal.icon}
                    size={20}
                    color="#fff"
                    style={styles.modalIcon}
                  />
                ) : null}

                <Text style={styles.modalTitleText}>
                  {(whyModal?.title || '').replace(/\n/g, ' ')}
                </Text>

              </View>
            </LinearGradient>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalText}>{whyModal?.content}</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setWhyModal(null)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

/** ===== HomeScreen ===== */
const HomeScreen = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.background}>
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <Body />

            <Text style={styles.sectionTitle}>📢 Ils parlent de nous</Text>
            <MediaCards />

            <Footer />
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { flex: 1, backgroundColor: 'transparent' },
  bodyContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#9b59b6',
    marginTop: 24,
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1,
  },

  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#9b59b6',
    textAlign: 'center',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '400',
  },

  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    gap: 8,
    paddingHorizontal: 5,
  },
  flipContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  flipGradient: {
    width: 85,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  flipNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  flipIcon: { marginBottom: 5 },
  flipLabel: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  ctaContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    marginBottom: 18,
  },
  registerButton: {
    width: width * 0.88,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },

  statsTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000',
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: width * 0.28,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9b59b6',
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 6,
  },

  // Pourquoi venir
  whySection: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  whySectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#9b59b6',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 34,
  },
  whyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  whyCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  whyIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  whyCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  whyCardDescription: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  whyMoreBtn: {
    marginTop: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  whyMoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    marginRight: 10,
  },
  modalTitleText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    flexShrink: 1,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    maxHeight: 320,
  },
  modalText: {
    color: '#444',
    fontSize: 14,
    lineHeight: 20,
  },
  modalClose: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  modalCloseText: {
    fontWeight: '800',
    color: '#8a348a',
    fontSize: 15,
  },

  // Media
  mediaContainer: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  mediaCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  mediaLogoWrap: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaLogoCircle: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#f2e6fa',
  },
  mediaLogoInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mediaLogo: {
    width: 46,
    height: 46,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    marginBottom: 6,
  },
  mediaExcerpt: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
    marginBottom: 10,
  },
  mediaBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9b59b6',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  mediaBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },

  // Footer
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f2e6fa',
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 80,
  },
  footerText: {
    fontSize: 13,
    color: '#8a348a',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerSocials: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  footerIcon: { marginHorizontal: 8, opacity: 0.85 },
});

export default HomeScreen;
