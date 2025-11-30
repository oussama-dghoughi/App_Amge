import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Text, TouchableOpacity, Linking, Image, Modal, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import Body from '../components/HomeScreen/Body';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const PourquoiTimelineItem = ({ index, icon, title, content }) => {
  const [expanded, setExpanded] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 180}
      duration={900}
      useNativeDriver
      style={{ width: '100%' }}
    >
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.95}
        style={[
          styles.timelineCard,
          pressed && styles.timelineCardPressed,
        ]}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
      >
        <BlurView intensity={70} tint="light" style={styles.timelineBlur}>
          <View style={styles.timelineRow}>
            <View style={styles.timelineBadgeBox}>
              <View style={styles.timelineBadge}><Text style={styles.timelineBadgeText}>{index + 1}</Text></View>
              <View style={styles.timelineIconBox}>
                <Text style={styles.timelineIcon}>{icon}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.timelineTitle}>{title}</Text>
              {expanded && (
                <Animatable.View animation="fadeIn" duration={400}>
                  <Text style={styles.timelineContent}>{content}</Text>
                </Animatable.View>
              )}
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const PlanningItem = ({ time, title, description, index }) => (
  <Animatable.View
    animation="fadeInUp"
    delay={index * 120}
    duration={800}
    useNativeDriver
  >
    <BlurView intensity={40} tint="light" style={styles.planningCardBlur}>
      <View style={styles.planningCard}>
        <LinearGradient
          colors={["#8a348a", "#c76b98"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planningTimeBox}
        >
          <Text style={styles.planningTime}>{time}</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.planningCardTitle}>{title}</Text>
          <Text style={styles.planningDescription}>{description}</Text>
        </View>
      </View>
    </BlurView>
  </Animatable.View>
);

const MediaCards = () => (
  <View style={styles.mediaContainer}>
    {MEDIA_DATA.map((m, idx) => {
      const isLeft = idx % 2 === 0;
      return (
        <Animatable.View
          key={m.title}
          animation="fadeInUp"
          delay={idx * 120}
          style={[styles.mediaWowCard, { flexDirection: isLeft ? 'row' : 'row-reverse' }]}
        >
          <BlurView intensity={60} tint="light" style={styles.mediaWowBlur}>
            <View style={styles.mediaWowRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.mediaWowLogoWrap}
                onPress={() => Linking.openURL(m.url)}
              >
                <LinearGradient
                  colors={["#8a348a", "#c76b98"]}
                  style={styles.mediaWowLogoGlow}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Image source={m.logo} style={styles.mediaWowLogo} resizeMode="contain" />
              </TouchableOpacity>
              <View style={styles.mediaWowContent}>
                <LinearGradient
                  colors={["#8a348a", "#c76b98"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mediaWowTitleGradient}
                >
                  <Text style={styles.mediaWowTitle}>{m.title}</Text>
                </LinearGradient>
                <Animatable.Text animation="fadeIn" delay={idx * 200 + 200} style={styles.mediaWowExcerpt}>{m.excerpt}</Animatable.Text>
                <TouchableOpacity style={styles.mediaWowBtn} onPress={() => Linking.openURL(m.url)}>
                  <Text style={styles.mediaWowBtnText}>Lire la suite</Text>
                  <Icon name="chevron-right" size={18} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Animatable.View>
      );
    })}
  </View>
);

const POURQUOI_DATA = [
  {
    title: "Prestige",
    icon: "✨",
    short: "Rencontrez les meilleures entreprises marocaines et internationales.",
    content: "Venez à la rencontre des meilleures entreprises marocaines et multinationales.\n\nÉtudiants, jeunes diplômés ou expérimentés, intéressés par un emploi en Afrique ou curieux du marché de l'emploi africain : Notre Forum est fait pour vous !\n\nÀ la clé : CDI, stages et beaucoup d'échanges. Même ceux qui ne recherchent pas d'emploi y trouveront leur bonheur.\n\nTout au long de la journée, des conférences de qualité seront tenues avec des invités prestigieux."
  },
  {
    title: "Networking",
    icon: "🤝",
    short: "Développez votre réseau avec des acteurs majeurs.",
    content: "C'est l'occasion rêvée pour échanger avec de nombreux acteurs du tissu économique : grands groupes, PME et startups.\n\nSi vous êtes en recherche active d'un emploi ou d'un stage, c'est l'endroit idéal !\n\nLes recruteurs reçoivent souvent des candidatures par mail, mais rien ne vaut un dépôt de CV physique. Pensez à venir avec le vôtre pour le transmettre directement aux recruteurs, sans passer par un process long et parfois non concluant.\n\nMême si vous ne comptez pas quitter votre emploi actuel, il est toujours utile de développer son réseau. Ne ratez pas cette opportunité !"
  },
  {
    title: "Instruction",
    icon: "📝",
    short: "Des conférences et ateliers pour tous les goûts.",
    content: "Les conférences organisées ne seront pas axées sur un seul thème.\n\nVous aurez un vaste choix :\n- Des ateliers d'entreprises pour découvrir les plus grands groupes africains.\n- Des conférences sur le développement personnel au travail.\n- Des discussions sur l'actualité économique du continent.\n\nY'en aura pour tous les goûts !"
  },
  {
    title: "Projection",
    icon: "🌍",
    short: "Affinez votre projet professionnel avec des experts.",
    content: "Quel que soit votre parcours ou formation, nos prestigieux exposants seront toujours disponibles pour :\n- Vous parler des postes proposés et des compétences recherchées.\n- Vous présenter leur entreprise et leurs attentes.\n\nCes échanges vous aideront à :\n- Construire votre propre opinion\n- Affiner votre projet professionnel\n\nCes professionnels sauront vous aiguiller mieux que quiconque."
  }
];

const PLANNING_DATA = [
  {
    time: "9h30 - 10h30",
    title: "Le Marché de l'Emploi en Afrique",
    type: "conférence",
    description: "Discussion sur les opportunités d'emploi et les tendances du marché dans les différents secteurs."
  },
  {
    time: "10h30 - 12h00",
    title: "Rédiger un CV Impactant",
    type: "atelier",
    description: "Un atelier pour améliorer vos CV et les adapter aux exigences du marché."
  }
];

const MEDIA_DATA = [
  {
    logo: require('../assets/medi1.png'),
    title: "منتدى آفاق المغرب.. أو طريق العودة إلى الوطن",
    excerpt: " من الطلاب المغاربة إلى بلدان أوروبية منها فرنسا لإتمام دراستهم أو البحث عن عمل بعد الحصول على شهادات تؤهلهم ...",
    url: "https://www.medi1.com/ar/episode/198031/%D9%85%D9%86%D8%AA%D8%AF%D9%89-%D8%A2%D9%81%D8%A7%D9%82-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8.-%D8%A3%D9%88-%D8%B7%D8%B1%D9%8A%D9%82-%D8%A7%D9%84%D8%B9%D9%88%D8%AF%D8%A9-%D8%A5%D9%84%D9%89-%D8%A7%D9%84%D9%88%D8%B7%D9%86"
  },
  {
    logo: require('../assets/snrt.png'),
    title: "Le Forum Horizons Maroc, invité de la SNRT",
    excerpt: "Invité de l'émission matinale « Sbah Bladi », Ahmed Belghiti...",
    url: "https://soundcloud.com/hassan-yazane-965217114/intervention-snrt-forum-horizons-maroc"
  },
  {
    logo: require('../assets/map.png'),
    title: "Le Forum Horizons Maroc revient fin mai à Paris avec une nouvelle édition tournée vers l'Afrique",
    excerpt: "IParis -Après une édition 100% digitale en 2021 à cause de la pandémie mondiale du Covid-19, le Forum Horizons Maroc...",
    url: "https://www.mapexpress.ma/actualite/economie-et-finance/forum-horizons-maroc-revient-fin-mai-paris-nouvelle-edition-tournee-vers-lafrique/"
  }
];

const PourquoiCardsModern = () => {
  const [modal, setModal] = useState(null);
  return (
    <View style={styles.whyContainer}>
      {POURQUOI_DATA.map((item, idx) => (
        <Animatable.View key={item.title} animation="fadeInUp" delay={idx*120} style={styles.whyCard}>
          <LinearGradient colors={["#8a348a", "#c76b98"]} style={styles.whyIconCircle}>
            <Text style={styles.whyIcon}>{item.icon}</Text>
          </LinearGradient>
          <Text style={styles.whyTitle}>{item.title}</Text>
          <Text style={styles.whyShort}>{item.short}</Text>
          <TouchableOpacity style={[styles.whyMoreBtn, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => setModal(item)}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15, marginRight: 8}}>Lire la suite</Text>
            <Icon name="chevron-right" size={20} color="#fff" />
          </TouchableOpacity>
        </Animatable.View>
      ))}
      {/* Modal pour le détail */}
      <Modal visible={!!modal} transparent animationType="fade" onRequestClose={() => setModal(null)}>
        <View style={styles.whyModalOverlay}>
          <Animatable.View animation="zoomIn" duration={400} style={styles.whyModalContent}>
            <LinearGradient colors={["#8a348a", "#c76b98"]} style={styles.whyModalHeader}>
              <Text style={styles.whyModalTitle}>{modal?.icon} {modal?.title}</Text>
            </LinearGradient>
            <ScrollView style={{ maxHeight: 260 }}>
              <Text style={styles.whyModalText}>{modal?.content}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.whyModalClose} onPress={() => setModal(null)}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Retour</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

const PlanningTimelinePremium = () => (
  <View style={styles.timelinePremiumContainer}>
    {/* Ligne centrale dégradée verticale en absolu */}
    <LinearGradient
      colors={["#8a348a", "#c76b98"]}
      style={styles.timelinePremiumLineVertical}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    />
    {PLANNING_DATA.map((ev, idx) => {
      const isLeft = idx % 2 === 0;
      const isConf = ev.type === 'conférence';
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
                <View style={[styles.timelineTypeBadge, isConf ? styles.timelineTypeConf : styles.timelineTypeAtelier]}>
                  <Text style={styles.timelineTypeBadgeText}>{isConf ? '🎤 Conférence' : '🛠️ Atelier'}</Text>
                </View>
                <Text style={styles.timelinePremiumDesc}>{ev.description}</Text>
              </View>
            </BlurView>
          </View>
        </Animatable.View>
      );
    })}
  </View>
);

const Footer = () => (
  <View style={styles.footerContainer}>
    <Text style={styles.footerText}>
      © Forum Horizons Maroc 2026. Tous droits réservés.
    </Text>
    <View style={styles.footerSocials}>
      <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/forumhorizonsmaroc')}>
        <Icon name="facebook-square" size={28} color="#4267B2" style={styles.footerIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('https://linkedin.com/company/forum-horizons-maroc')}>
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

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <Header navigation={navigation} />
        <ImageBackground
          source={require('../assets/BackGround.jpeg')}
          style={styles.background}
          imageStyle={{ opacity: 0.3 }}
        >
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <Body navigation={navigation} />
            {/* Pourquoi venir au forum - Cards modernes et concises */}
            <Text style={styles.sectionTitle}>Pourquoi venir au forum ⁉️</Text>
            <PourquoiCardsModern />
            {/* Planning de la journée du forum - Timeline verticale premium */}
            <Text style={styles.sectionTitle}>🗓️ Ne ratez pas</Text>
            <PlanningTimelinePremium />
            {/* Ils parlent de nous - Cards médias modernes */}
            <Text style={styles.sectionTitle}>📢 Ils parlent de nous</Text>
            <MediaCards />
            <Footer />
          </ScrollView>
        </ImageBackground>
        <View style={styles.bottomNavContainer}>
          <BottomNavigationBar navigation={navigation} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  bodyContainer: {
    flexGrow: 1,
    paddingTop: 20,
    marginBottom: 26, // Ensures Body stops exactly where the Bottom Navigation starts
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,  // Adjust based on your BottomNavigationBar height
    backgroundColor: '#fff',
    elevation: 5,  // Shadow effect for Android
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5,
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
  timelineList: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineBlur: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineBadgeBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2e6fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8a348a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  timelineIconBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIcon: {
    fontSize: 16,
    color: '#8a348a',
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 4,
  },
  timelineContent: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  planningList: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  planningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f3fc',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  planningTimeBox: {
    backgroundColor: '#8a348a',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 14,
    alignSelf: 'flex-start',
  },
  planningTime: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  planningCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 4,
  },
  planningDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  seeMoreButton: {
    backgroundColor: '#8a348a',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    elevation: 2,
  },
  seeMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  mediaList: {
    marginHorizontal: 10,
    marginBottom: 30,
  },
  mediaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
  },
  mediaLogo: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f2e6fa',
  },
  mediaHeadline: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 4,
  },
  mediaExcerpt: {
    fontSize: 13,
    color: '#444',
    marginBottom: 6,
  },
  readMore: {
    fontSize: 13,
    color: '#8a348a',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    marginTop: 2,
  },
  sectionHeaderGradient: {
    borderRadius: 18,
    marginHorizontal: 10,
    marginTop: 30,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineCardPressed: {
    backgroundColor: '#f2e6fa',
  },
  bubbleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bubble: {
    width: '45%',
    height: 100,
    borderRadius: 100,
    margin: 5,
    overflow: 'hidden',
  },
  bubblePressed: {
    backgroundColor: '#f2e6fa',
  },
  bubbleGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleIcon: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8a348a',
  },
  bubbleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
  },
  bubbleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleModalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  bubbleModalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#8a348a',
    paddingBottom: 10,
  },
  bubbleModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 10,
  },
  bubbleModalText: {
    fontSize: 15,
    color: '#444',
  },
  bubbleModalClose: {
    backgroundColor: '#8a348a',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 10,
  },
  whyContainer: {
    marginHorizontal: 10,
    marginBottom: 30,
  },
  whyCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  whyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2e6fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whyIcon: {
    fontSize: 16,
    color: '#8a348a',
  },
  whyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 4,
  },
  whyShort: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  whyMoreBtn: {
    backgroundColor: '#8a348a',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'flex-end',
  },
  whyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whyModalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  whyModalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#8a348a',
    paddingBottom: 10,
  },
  whyModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 10,
  },
  whyModalText: {
    fontSize: 15,
    color: '#444',
  },
  whyModalClose: {
    backgroundColor: '#8a348a',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 10,
  },
  timelineContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2e6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  timelineBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8a348a',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 4,
  },
  timelineDesc: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  mediaContainer: {
    marginHorizontal: 10,
    marginBottom: 30,
  },
  mediaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
  },
  mediaText: {
    flex: 1,
  },
  mediaTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 4,
  },
  mediaBtn: {
    backgroundColor: '#8a348a',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'flex-end',
  },
  mediaBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  timelineGraphScroll: {
    height: 100,
  },
  timelineNode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2e6fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineHour: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8a348a',
  },
  timelineLine: {
    width: 20,
    height: 2,
    backgroundColor: '#8a348a',
    marginHorizontal: 10,
  },
  timelineNodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8a348a',
    marginLeft: 10,
  },
  timelineVerticalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timelineVerticalLine: {
    height: 2,
    backgroundColor: '#8a348a',
    flex: 1,
  },
  timelineVerticalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineVerticalContent: {
    flex: 1,
  },
  timelineVerticalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineVerticalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 4,
  },
  timelineVerticalBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2e6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  timelineVerticalBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8a348a',
  },
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
  },
  timelinePremiumBadgeTextBig: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  mediaWowCard: {
    width: '100%',
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaWowBlur: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 6,
    width: '98%',
  },
  mediaWowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mediaWowLogoWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  mediaWowLogoGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.35,
    zIndex: 1,
  },
  mediaWowLogo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    zIndex: 2,
    backgroundColor: '#fff',
  },
  mediaWowContent: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'flex-start',
  },
  mediaWowTitleGradient: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  mediaWowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#fff',
    textShadowColor: '#8a348a55',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  mediaWowExcerpt: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    marginTop: 2,
    lineHeight: 20,
  },
  mediaWowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8a348a',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 22,
    alignSelf: 'flex-end',
    marginTop: 6,
    elevation: 2,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  mediaWowBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f2e6fa',
    marginTop: 10,
    marginBottom: 18,
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
  footerIcon: {
    marginHorizontal: 8,
    opacity: 0.85,
  },
});

export default HomeScreen;