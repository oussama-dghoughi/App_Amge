import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
  Image,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderMenu from '../../components/HomeScreen/Header';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';

const AProposScreen = ({navigation}) => {
  return (
    <SafeAreaProvider>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <HeaderMenu navigation={navigation} />
        </View>

        <ImageBackground
          source={require('../../assets/BackGround.jpeg')} 
          style={styles.background}
          imageStyle={{ opacity: 0.15 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section with Gradient */}
            <LinearGradient
              colors={['#A34392', '#8a348a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.headerText}>À Propos</Text>
            </LinearGradient>

            {/* Box: "Qu'est-ce que le FHM ?" */}
            <View style={styles.fhmBox}>
              <Text style={styles.fhmTitle}>Qu'est-ce que le FHM ?</Text>
              <Text style={styles.fhmDescription}>
                Le Forum Horizons Maroc (FHM) a pour vocation de promouvoir
                le marché du travail marocain et se veut comme le lieu
                de rencontre par excellence entre les entreprises marocaines
                et les étudiants ou professionnels de toutes nationalités
                désireux de saisir les opportunités professionnelles
                qu'offre le marché de travail marocain.
              </Text>
            </View>

            {/* Vertical chain of circles with gradients */}
            <View style={styles.circleContainer}>
              <LinearGradient
                colors={['#A34392', '#8a348a']}
                style={styles.circle}
              >
                <Text style={styles.circleText}>+60{'\n'}Entreprises</Text>
              </LinearGradient>

              <LinearGradient
                colors={['#A34392', '#8a348a']}
                style={styles.circle}
              >
                <Text style={styles.circleText}>+3000{'\n'}Visiteurs</Text>
              </LinearGradient>

              <LinearGradient
                colors={['#A34392', '#8a348a']}
                style={styles.circle}
              >
                <Text style={styles.circleText}>Ateliers et{'\n'}conférences</Text>
              </LinearGradient>
            </View>

            {/* Box: Notre association (AMGE Caravane) */}
            <View style={styles.associationBox}>
              <View style={styles.associationLogoRow}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.associationLogo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.associationTitle}>Notre association</Text>
              <Text style={styles.associationText}>
                Fondée en 1994, l'Association des Marocains aux Grandes Écoles
                (AMGE – Caravane) est une association française indépendante,
                apolitique et areligieuse. Notre mission est d'assister les
                étudiants marocains avant, pendant et après leur séjour en France.
                Avec plus de 5000 alumni issus des Grandes Écoles d'Ingénieurs,
                de Commerce et des Universités, notre réseau, axé sur le service
                de l'étudiant marocain, vise également à contribuer au rayonnement
                du Maroc en France. Notre objectif principal demeure d'être au
                service de l'étudiant marocain sur les plans personnel et
                professionnel.
              </Text>
            </View>
          </ScrollView>
        </ImageBackground>

        {/* Bottom Navigation Bar */}
        <View style={styles.navBarContainer}>
          <SafeAreaView edges={['bottom']}>
            <BottomNavigationBar navigation={navigation} />
          </SafeAreaView>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginTop: Platform.OS === 'ios' ? 45 : 25,
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  headerGradient: {
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  fhmBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fhmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#8a348a',
  },
  fhmDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    color: '#333',
  },
  circleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  circleText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  associationBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  associationLogoRow: {
    alignItems: 'center',
    marginBottom: 15,
  },
  associationLogo: {
    width: 120,
    height: 50,
  },
  associationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#8a348a',
  },
  associationText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    color: '#333',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default AProposScreen;