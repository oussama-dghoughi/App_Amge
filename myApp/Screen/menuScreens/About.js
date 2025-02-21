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
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/HomeScreen/Header';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';

const AProposScreen = ({navigation}) => {
  // Handlers for the header buttons, if needed
  const handleMenuPress = () => {
    console.log('Menu button pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile button pressed');
  };

  return (
    <SafeAreaProvider>
        {/* Safe area for header */}
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <StatusBar
            backgroundColor="#fff"
            barStyle="dark-content"
            translucent={Platform.OS === 'android'}
          />
          <View style={styles.headerContainer}>
            <Header navigation={navigation} />
          </View>
        </SafeAreaView>
      <ImageBackground
        source={require('../../assets/BackGround.jpeg')} 
        style={styles.background}
        imageStyle={{ opacity: 0.5 }} 
      >

          <ScrollView contentContainerStyle={styles.scrollContainer}>

            {/* 
              Optional: If you have a “Forum Horizons Maroc Paris 2024” logo, 
              you could place it here or keep it in the Header 
            */}
            {/*
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/fhmLogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            */}

            {/* Box: "Qu'est-ce que le FHM ?" */}
            <View style={styles.fhmBox}>
              <Text style={styles.fhmTitle}>Qu’est-ce que le FHM ?</Text>
              <Text style={styles.fhmDescription}>
                Le Forum Horizons Maroc (FHM) a pour vocation de promouvoir
                le marché du travail marocain et se veut comme le lieu
                de rencontre par excellence entre les entreprises marocaines
                et les étudiants ou professionnels de toutes nationalités
                désireux de saisir les opportunités professionnelles
                qu’offre le marché de travail marocain.
              </Text>
            </View>

            {/* Vertical chain of circles: +60 Entreprises, +3000 Visiteurs, Ateliers & Conférences */}
            <View style={styles.circleContainer}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>+60{'\n'}Entreprises</Text>
              </View>
              <View style={styles.circle}>
                <Text style={styles.circleText}>+3000{'\n'}Visiteurs</Text>
              </View>
              <View style={styles.circle}>
                <Text style={styles.circleText}>Ateliers et{'\n'}conférences</Text>
              </View>
            </View>

            {/* Box: Notre association (AMGE Caravane) */}
            <View style={styles.associationBox}>
              {/* Logo row (optional) */}
              <View style={styles.associationLogoRow}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.associationLogo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.associationTitle}>Notre association</Text>
              <Text style={styles.associationText}>
                Fondée en 1994, l’Association des Marocains aux Grandes Écoles
                (AMGE – Caravane) est une association française indépendante,
                apolitique et areligieuse. Notre mission est d’assister les
                étudiants marocains avant, pendant et après leur séjour en France.
                Avec plus de 5000 alumni issus des Grandes Écoles d’Ingénieurs,
                de Commerce et des Universités, notre réseau, axé sur le service
                de l’étudiant marocain, vise également à contribuer au rayonnement
                du Maroc en France. Notre objectif principal demeure d’être au
                service de l’étudiant marocain sur les plans personnel et
                professionnel.
              </Text>
            </View>

          </ScrollView>
          <BottomNavigationBar />
      </ImageBackground>
    </SafeAreaProvider>
  );
};

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },

  // If you have a logo for FHM
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 60,
  },

  // ---- "Qu'est-ce que le FHM ?" Box ----
  fhmBox: {
    backgroundColor: '#fff',
    borderColor: '#26b1cc', // Teal border, adjust as needed
    borderWidth: 2,
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
  },
  fhmTitle: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000', // or #8a348a if you prefer
  },
  fhmDescription: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    lineHeight: 20,
    textAlign: 'justify',
    color: '#333',
  },

  // ---- Circles (stats) ----
  circleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#26b1cc', // Teal
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  circleText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    fontWeight: '600',
    lineHeight: 20,
  },

  // ---- Association Box (AMGE Caravane) ----
  associationBox: {
    backgroundColor: '#fff',
    borderColor: '#d60000', // Red border, adjust as needed
    borderWidth: 2,
    borderRadius: 15,
    padding: 15,
    marginBottom: 50, // space at bottom
  },
  associationLogoRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  associationLogo: {
    width: 120,
    height: 50,
  },
  associationTitle: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: '#000', // or #8a348a
  },
  associationText: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    lineHeight: 20,
    textAlign: 'justify',
    color: '#333',
  },
});

export default AProposScreen;