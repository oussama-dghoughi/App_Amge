import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/HomeScreen/Header';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FAQ = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleAnswer = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <SafeAreaProvider>
      {/* Header with zIndex to stay on top */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <Header navigation={navigation}/>
      </SafeAreaView>

      {/* Content with lower zIndex */}
      <ImageBackground 
        source={require('../../assets/BackGround.jpeg')} 
        style={[styles.background, menuVisible && styles.dimmedBackground]}
        imageStyle={{ opacity: 0.5 }}
      >
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={Platform.OS === 'android'} />
          
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.mainContainer}>
              <Text style={styles.title}>Frequently Asked Questions</Text>
              
              {[ 
                  {
                    question: "Qu'est-ce que le FHM ?",
                    answer: "Le Forum Horizons Maroc (FHM) a pour vocation de promouvoir le marché du travail marocain...",
                  },
                  {
                    question: "Où et quand se déroulera le FHM 2025 ?",
                    answer: "Le FHM 2025 aura lieu le 01/06/2025 à l'Espace Champerret...",
                  },
                  {
                    question: "Qui peut participer au FHM ?",
                    answer: "Étudiants, jeunes cadres diplômés et professionnels expérimentés...",
                  },
                  {
                    question: "Comment puis-je m'inscrire au FHM ?",
                    answer: "Vous pouvez vous inscrire directement via l'application FHM...",
                  },
                  {
                    question: "Quels types d'entreprises participent ?",
                    answer: "Les entreprises participantes couvrent divers secteurs, notamment...",
                  },
                ].map((item, index) => (
                <View key={index} style={styles.faqBox}>
                  <TouchableOpacity onPress={() => toggleAnswer(index)} style={styles.questionContainer}>
                    <Text style={styles.question}>{item.question}</Text>
                    <View style={[styles.arrowContainer, expandedIndex === index && styles.arrowExpanded]}>
                      <Icon name="chevron-right" size={20} color="#fff" />
                    </View>
                  </TouchableOpacity>
                  {expandedIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
                </View>
              ))}
            </View>
          </ScrollView>
          
          <BottomNavigationBar />
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: '#fff',
    zIndex: 2,
    elevation: 2,
  },
  background: {
    flex: 1,
    zIndex: 1,
    marginTop: -1, // Removes gap between header and content
  },
  dimmedBackground: {
    opacity: 0.3, // Optional dim effect when menu is open
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
    elevation: 1,
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: Platform.select({
      ios: 20,
      android: StatusBar.currentHeight + 20
    }),
    zIndex: 2,
    elevation: 2,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#8A2BE2',
    textAlign: 'center',
    marginVertical: 20,
    zIndex: 2,
    elevation: 2,
  },
  contentContainer: {
    paddingBottom: 20,
    zIndex: 2,
    elevation: 2,
  },
  faqBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 2,
    elevation: 2,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    flex: 1,
    marginRight: 10,
    zIndex: 2,
    elevation: 2,
  },
  arrowContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2,
  },
  arrowExpanded: {
    transform: [{ rotate: '180deg' }],
    zIndex: 2,
    elevation: 2,
  },
  answer: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginTop: 10,
    zIndex: 2,
    elevation: 2,
  },
});

export default FAQ;
