import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import Body from '../components/HomeScreen/Body';
import { View, StyleSheet, ScrollView, ImageBackground, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState } from 'react';
import { Image } from 'react-native';
import { Linking } from 'react-native';


const PourquoiItem = ({ title, icon, content, align }) => {
  const [expanded, setExpanded] = useState(false);

  const containerStyle = {
    alignSelf: align, 
  backgroundColor: '#f2e6fa',
  padding: 15,
  borderRadius: 10,
  marginVertical: 10,
  maxWidth: '85%',
  elevation: 2,
  ...(title === 'Networking' && { marginLeft: -50 }),
  ...(title === 'Instruction' && { marginRight: -50 }),
  };
  const PlanningItem = ({ time, title, description }) => {
    return (
      <View style={styles.planningItem}>
        <Text style={styles.planningTime}>{time}</Text>
        <Text style={styles.planningTitle}>{title}</Text>
        <Text style={styles.planningDescription}>{description}</Text>
      </View>
    );
  };
  

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)} style={containerStyle}>
    <Text style={{ fontSize: 18, fontWeight: '600', color: '#6A0DAD' }}>
      {icon} {title}
    </Text>
    {expanded && (
      <Text style={{ fontSize: 14, color: '#333', marginTop: 8 }}>
        {content}
      </Text>
    )}
  </TouchableOpacity>
);
};


const HomeScreen = ({ navigation }) => {
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Header navigation={navigation} />

        {/* Background Image */}
        <ImageBackground
          source={require('../assets/BackGround.jpeg')}
          style={styles.background}
          imageStyle={{ opacity: 0.3 }}
        >
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            {/* Corps */}
            <Body />
            {/* Pourquoi venir au forum */}
<View style={styles.banniereContainer}>
  <Text style={styles.pourquoiTitle}>Pourquoi venir au forum ⁉️</Text>
</View>

            <View style={styles.pourquoiContainer}>

            <PourquoiItem
  title="Prestige"
  icon="✨"
  align="flex-start"
  content={
    <>
      <Text style={{ fontWeight: 'bold' }}>
        Venez à la rencontre des meilleures entreprises marocaines et multinationales.
      </Text>
      {"\n\n"}
      <Text>
        Étudiants, <Text style={{ fontWeight: 'bold' }}>jeunes diplômés</Text> ou{" "}
        <Text style={{ fontWeight: 'bold' }}>expérimentés</Text>, intéressés par un emploi en Afrique ou curieux du marché de l’emploi africain :{" "}
        <Text style={{ fontWeight: 'bold' }}>Notre Forum est fait pour vous !</Text>
      </Text>
      {"\n\n"}
      <Text>
        À la clé : <Text style={{ fontWeight: 'bold' }}>CDI</Text>,{" "}
        <Text style={{ fontWeight: 'bold' }}>stages</Text> et{" "}
        <Text style={{ fontWeight: 'bold' }}>beaucoup d’échanges</Text>.{" "}
        Même ceux qui ne recherchent pas d’emploi{" "}
        <Text style={{ fontWeight: 'bold' }}>y trouveront leur bonheur</Text>.
      </Text>
      {"\n\n"}
      <Text>
        Tout au long de la journée,{" "}
        <Text style={{ fontWeight: 'bold' }}>des conférences de qualité</Text>{" "}
        seront tenues avec des{" "}
        <Text style={{ fontWeight: 'bold' }}>invités prestigieux</Text>.
      </Text>
    </>
  }
/>

<PourquoiItem
  title="Networking"
  icon="🤝"
  align="center"
  content={
    <>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>C’est l’occasion rêvée</Text> pour échanger avec de nombreux acteurs du tissu économique :{" "}
        <Text style={{ fontWeight: 'bold' }}>grands groupes</Text>,{" "}
        <Text style={{ fontWeight: 'bold' }}>PME</Text> et{" "}
        <Text style={{ fontWeight: 'bold' }}>startups</Text>.
      </Text>

      {"\n\n"}

      <Text>
        Si vous êtes en <Text style={{ fontWeight: 'bold' }}>recherche active</Text> d’un{" "}
        <Text style={{ fontWeight: 'bold' }}>emploi</Text> ou d’un{" "}
        <Text style={{ fontWeight: 'bold' }}>stage</Text>, c’est{" "}
        <Text style={{ fontWeight: 'bold' }}>l’endroit idéal</Text> !
      </Text>

      {"\n\n"}

      <Text>
        Les recruteurs reçoivent souvent des candidatures par mail,{" "}
        <Text style={{ fontWeight: 'bold' }}>mais rien ne vaut un dépôt de CV physique</Text>. Pensez à venir avec le vôtre pour le{" "}
        <Text style={{ fontWeight: 'bold' }}>transmettre directement</Text> aux recruteurs, sans passer par un{" "}
        <Text style={{ fontWeight: 'bold' }}>process long</Text> et{" "}
        <Text style={{ fontWeight: 'bold' }}>parfois non concluant</Text>.
      </Text>

      {"\n\n"}

      <Text>
        Même si vous ne comptez pas quitter votre emploi actuel,{" "}
        <Text style={{ fontWeight: 'bold' }}>il est toujours utile de développer son réseau</Text>.{" "}
        <Text style={{ fontWeight: 'bold' }}>Ne ratez pas cette opportunité !</Text>
      </Text>
    </>
  }
/>

<PourquoiItem
  title="Instruction"
  icon="📝"
  align="center"
  content={
    <>
      <Text>
        Les <Text style={{ fontWeight: 'bold' }}>conférences organisées</Text> ne seront pas axées sur un seul thème.
      </Text>

      {"\n\n"}

      <Text>
        Vous aurez un <Text style={{ fontWeight: 'bold' }}>vaste choix</Text> :
      </Text>

      {"\n"}
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Des ateliers d’entreprises</Text> pour découvrir les{" "}
        <Text style={{ fontWeight: 'bold' }}>plus grands groupes africains</Text>.
      </Text>

      <Text>
        - <Text style={{ fontWeight: 'bold' }}>
          Des conférences sur le développement personnel au travail
        </Text>.
      </Text>

      <Text>
        - <Text style={{ fontWeight: 'bold' }}>
          Des discussions sur l’actualité économique du continent
        </Text>.
      </Text>

      {"\n\n"}

      <Text>
        <Text style={{ fontWeight: 'bold' }}>Y’en aura pour tous les goûts !</Text>
      </Text>
    </>
  }
/>


<PourquoiItem
  title="Projection"
  icon="🌍"
  align="flex-end"
  content={
    <>
      <Text>
        Quel que soit votre <Text style={{ fontWeight: 'bold' }}>parcours</Text> ou{" "}
        <Text style={{ fontWeight: 'bold' }}>formation</Text>, nos{" "}
        <Text style={{ fontWeight: 'bold' }}>prestigieux exposants</Text> seront toujours disponibles pour :
      </Text>

      {"\n\n"}

      <Text>
        - Vous parler des <Text style={{ fontWeight: 'bold' }}>postes proposés</Text> et des{" "}
        <Text style={{ fontWeight: 'bold' }}>compétences recherchées</Text>.
      </Text>
      <Text>
        - Vous présenter leur <Text style={{ fontWeight: 'bold' }}>entreprise</Text> et leurs attentes.
      </Text>

      {"\n\n"}

      <Text>Ces échanges vous aideront à :</Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Construire votre propre opinion</Text>
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Affiner votre projet professionnel</Text>
      </Text>

      {"\n\n"}

      <Text>
        <Text style={{ fontWeight: 'bold' }}>
          Ces professionnels sauront vous aiguiller mieux que quiconque.
        </Text>
      </Text>
    </>
  }
/>



</View>

{/* Planning de la journée du forum */}
<View style={styles.banniereContainer}>
  <Text style={styles.planningTitle}>🗓️ Ne ratez pas  </Text>
</View>
              <View style={styles.planningContainer}>

              {/* Liste des événements */}
              <PlanningItem
                time="9h30 - 10h30"
                title="Conférence 1: Le Marché de l'Emploi en Afrique"
                description="Discussion sur les opportunités d'emploi et les tendances du marché dans les différents secteurs."
              />
              <PlanningItem
                time="10h30 - 12h00"
                title="Atelier Pratique: Rédiger un CV Impactant"
                description="Un atelier pour améliorer vos CV et les adapetr aux exigences du marché."
              />
              


               {/* Voir plus Button */}
            <TouchableOpacity style={styles.seeMoreButton} onPress={() => console.log("Voir plus clicked")}>
              <Text style={styles.seeMoreText}>Voir plus</Text>
            </TouchableOpacity>
</View>
                
                
{/* Ils ont parlé de nous */}
      <View style={styles.banniereContainer}>
          <Text style={styles.mediaTitle}>📢 Ils parlent de nous </Text>
          <View style={styles.mediaContainer}>
          <View style={styles.mediaCard}>
                <Image source={require('../assets/medi1.png')} style={styles.mediaLogo} resizeMode="contain" />
                <Text style={styles.mediaHeadline}>منتدى آفاق المغرب.. أو طريق العودة إلى الوطن</Text>
                <Text style={styles.mediaExcerpt}> من الطلاب المغاربة إلى بلدان أوروبية منها فرنسا لإتمام دراستهم أو البحث عن عمل بعد الحصول على شهادات تؤهلهم ...</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.medi1.com/ar/episode/198031/%D9%85%D9%86%D8%AA%D8%AF%D9%89-%D8%A2%D9%81%D8%A7%D9%82-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8.-%D8%A3%D9%88-%D8%B7%D8%B1%D9%8A%D9%82-%D8%A7%D9%84%D8%B9%D9%88%D8%AF%D8%A9-%D8%A5%D9%84%D9%89-%D8%A7%D9%84%D9%88%D8%B7%D9%86')}>
                  <Text style={styles.readMore}>Lire la suite</Text>
                </TouchableOpacity>
          </View>
          </View>


          <View style={styles.mediaCard}>
            <Image source={require('../assets/snrt.png')} style={styles.mediaLogo} resizeMode="contain" />
            <Text style={styles.mediaHeadline}>Le Forum Horizons Maroc, invité de la SNRT</Text>
            <Text style={styles.mediaExcerpt}>Invité de l’émission matinale « Sbah Bladi », Ahmed Belghiti...</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://soundcloud.com/hassan-yazane-965217114/intervention-snrt-forum-horizons-maroc')}>
            <Text style={styles.readMore}>Lire la suite</Text>
            </TouchableOpacity>
        </View>

          <View style={styles.mediaCard}>
            <Image source={require('../assets/map.png')} style={styles.mediaLogo} resizeMode="contain" />
            <Text style={styles.mediaHeadline}>Le Forum Horizons Maroc revient fin mai à Paris avec une nouvelle édition tournée vers l’Afrique</Text>
            <Text style={styles.mediaExcerpt}>IParis -Après une édition 100% digitale en 2021 à cause de la pandémie mondiale du Covid-19, le Forum Horizons Maroc...</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.mapexpress.ma/actualite/economie-et-finance/forum-horizons-maroc-revient-fin-mai-paris-nouvelle-edition-tournee-vers-lafrique/')}>
              <Text style={styles.readMore}>Lire la suite</Text>
            </TouchableOpacity>
          </View>
  </View>  


          </ScrollView>
        </ImageBackground>

        {/* Menu bas fixe */}
        <View style={styles.bottomNavContainer}>
          <BottomNavigationBar />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
const PlanningItem = ({ time, title, description }) => {
  return (
    <View style={styles.planningItem}>
      <Text style={styles.planningTime}>{time}</Text>
      <Text style={styles.planningTitle}>{title}</Text>
      <Text style={styles.planningDescription}>{description}</Text>
    </View>
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
    paddingBottom: 50, 
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
  pourquoiContainer: {
    padding: 20,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
  },
  banniereContainer: {
    backgroundColor: '#6A0DAD', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 15,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pourquoiTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Texte blanc (à revoir wach nkhliwh)
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  mediaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  planningTitle: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#fff', 
    textAlign: 'center',
    textTransform: 'uppercase', 
  },
  planningContainer: {
    padding: 20,
    marginTop: 20,
  },
  planningItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f2e6fa',
    borderRadius: 10,
    elevation: 2,
  },
  planningTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A0DAD',
  },
  planningDescription: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  seeMoreButton: {
    padding: 10,
    backgroundColor: '#8a348a',
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  mediaContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mediaCard: {
    backgroundColor: '#f5ebfb',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mediaLogo: {
    width: 120,
    height: 50,
    marginBottom: 10,
  },
  mediaHeadline: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#6A0DAD',
  },
  mediaExcerpt: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  readMore: {
    fontSize: 14,
    color: '#8a348a',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

export default HomeScreen;