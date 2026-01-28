import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ImageBackground, TouchableOpacity, Platform, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HeaderMenu from '../../components/HomeScreen/Header';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { fetchFaqs } from '../../services/faqApi';

const FAQ = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const response = await fetchFaqs();
      if (response.success) {
        setFaqData(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les questions par recherche
  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAnswer = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <SafeAreaProvider>
      <View style={styles.mainContainer}>
        <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
          <View style={styles.headerWrapper}>
            <HeaderMenu navigation={navigation} />
          </View>
        </SafeAreaView>

        <ImageBackground
          source={require('../../assets/BackGround.jpeg')}
          style={styles.background}
          imageStyle={{ opacity: 0.5 }}
        >
          <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={Platform.OS === 'android'} />

            <ScrollView contentContainerStyle={styles.contentContainer}>
              <View style={styles.mainContent}>
                {/* Header avec flèche retour + titre + sous-titre */}
                <View style={styles.headerSection}>

                  <Text style={styles.title}>FAQ</Text>
                  <Text style={styles.subtitle}>Découvrez ici les réponses aux question frequentes.</Text>
                </View>

                {/* Barre de recherche */}
                <View style={styles.searchContainer}>
                  <Icon name="magnify" size={20} color="#8E4DA6" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher une question"
                    placeholderTextColor="#555"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Liste des questions filtrées */}
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8E4DA6" />
                    <Text style={{ marginTop: 10, color: '#666' }}>Chargement des questions...</Text>
                  </View>
                ) : filteredFAQ.length > 0 ? (
                  filteredFAQ.map((item, index) => (
                    <View key={index} style={styles.faqBox}>
                      <TouchableOpacity onPress={() => toggleAnswer(index)} style={styles.questionContainer}>
                        <Text style={styles.question}>{item.question}</Text>
                        <Icon
                          name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                          size={24}
                          color="#8E4DA6"
                        />
                      </TouchableOpacity>
                      {expandedIndex === index && <Text style={styles.answer}>{item.answer}</Text>}
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Icon name="magnify-close" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>Aucune question trouvée pour "{searchQuery}"</Text>
                  </View>
                )}


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
  safeAreaHeader: {
    backgroundColor: '#fff',
  },
  headerWrapper: {
    backgroundColor: '#fff',
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
  headerSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 30, // Plus d'espace sous le header global
  },
  backButton: {
    padding: 5,
    marginBottom: 5,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8E4DA6',
    marginBottom: 12, // Plus d'espace sous le titre
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5, // Un peu plus de hauteur
    marginBottom: 30, // Plus d'espace sous la barre de recherche
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  pillsContainer: {
    marginBottom: 20,
  },
  pillsContent: {
    paddingRight: 20,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#8E4DA6',
  },
  pillGradient: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E4DA6',
  },
  pillTextSelected: {
    color: '#fff',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  faqBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
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
    color: '#8E4DA6',
    marginBottom: 10,
    flex: 1,
    marginRight: 10,
  },

  answer: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginTop: 10,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
  },
  contactButton: {
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  contactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default FAQ;
