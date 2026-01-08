import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HeaderMenu from '../../components/MenuScreens/HeaderMenu';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FAQ = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAnswer = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <SafeAreaProvider>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <HeaderMenu navigation={navigation} />
        </View>

        <ImageBackground 
          source={require('../../assets/BackGround.jpeg')} 
          style={styles.background}
          imageStyle={{ opacity: 0.5 }}
        >
          <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={Platform.OS === 'android'} />
            
            <ScrollView contentContainerStyle={styles.contentContainer}>
              <View style={styles.mainContent}>
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
            
            <BottomNavigationBar navigation={navigation} />
          </SafeAreaView>
        </ImageBackground>
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
  safeArea: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#8A2BE2',
    textAlign: 'center',
    marginVertical: 20,
  },
  contentContainer: {
    paddingBottom: 20,
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
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    flex: 1,
    marginRight: 10,
  },
  arrowContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  answer: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginTop: 10,
  },
});

export default FAQ;
