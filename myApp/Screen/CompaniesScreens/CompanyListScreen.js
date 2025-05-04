import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/HomeScreen/Header.js';
import { companies } from '../../data/companies.js';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar.js';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const CompanyListScreen = ({ navigation, openMenu }) => { 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fields = ['Toutes les catégories', ...new Set(companies.map((company) => company.field))];

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesField =
      selectedField === '' || selectedField === 'Toutes les catégories' || company.field === selectedField;
    return matchesSearch && matchesField;
  });

  const handleWebsitePress = (url) => {
    Linking.openURL(url).catch((err) => 
      console.error("Failed to open URL:", err)
    );
  };

  const getFieldIcon = (field) => {
    const icons = {
      'Banking': 'bank',
      'Insurance': 'shield-check',
      'Technology': 'laptop',
      'Consulting': 'briefcase',
      'Engineering': 'engine',
      'Investment': 'chart-line',
      'Construction': 'home',
      'Telecommunications': 'phone',
      'Energy': 'flash',
      'Retail': 'store',
      'Aviation': 'airplane',
      'Mining': 'pickaxe',
      'Food & Beverage': 'food',
      'Pharmaceuticals': 'medical-bag',
      'Logistics': 'truck',
      'Agriculture': 'sprout',
    };
    return icons[field] || 'office-building';
  };

  const renderCompanyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.companyCard}
      onPress={() => setSelectedCompany(item)}
    >
      <LinearGradient
        colors={['#8a348a', '#C76B98']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Icon name={getFieldIcon(item.field)} size={30} color="#fff" style={styles.fieldIcon} />
          <View style={styles.cardHeaderText}>
            <Text style={styles.companyName}>{item.name}</Text>
            <Text style={styles.fieldName}>{item.field}</Text>
          </View>
        </View>
        <Text style={styles.companyPreview} numberOfLines={2}>
          {item.details}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.viewMore}>Voir plus</Text>
          <Icon name="chevron-right" size={20} color="#fff" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../../assets/BackGround.jpeg')}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <View style={styles.headerContainer}>
            <Header navigation={navigation} openMenu={openMenu} />
          </View>
          {selectedCompany ? (
            <ScrollView style={styles.detailsContainer}>
              <LinearGradient
                colors={['#8a348a', '#C76B98']}
                style={styles.detailsHeader}
              >
                <Icon name={getFieldIcon(selectedCompany.field)} size={50} color="#fff" />
                <Text style={styles.detailsTitle}>{selectedCompany.name}</Text>
                <Text style={styles.detailsField}>{selectedCompany.field}</Text>
              </LinearGradient>

              <View style={styles.detailsContent}>
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>À propos</Text>
                  <Text style={styles.detailsText}>{selectedCompany.details}</Text>
                </View>

                {selectedCompany.website && (
                  <TouchableOpacity
                    style={styles.websiteButton}
                    onPress={() => handleWebsitePress(selectedCompany.website)}
                  >
                    <Icon name="web" size={24} color="#fff" style={styles.websiteIcon} />
                    <Text style={styles.websiteButtonText}>Visiter le site web</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedCompany(null)}
                >
                  <Icon name="arrow-left" size={24} color="#fff" style={styles.backIcon} />
                  <Text style={styles.backButtonText}>Retour à la liste</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <>
              <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <Icon name="magnify" size={24} color="#8a348a" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher une entreprise"
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setShowFieldModal(true)}
                >
                  <Icon name="filter-variant" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={filteredCompanies}
                keyExtractor={(item) => item.id}
                renderItem={renderCompanyItem}
                contentContainerStyle={styles.companyList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}

          <Modal
            transparent={true}
            visible={showFieldModal}
            animationType="slide"
            onRequestClose={() => setShowFieldModal(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Filtrer par secteur</Text>
                <ScrollView style={styles.fieldsList}>
                  {fields.map((field, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.fieldItem,
                        selectedField === field && styles.fieldItemSelected
                      ]}
                      onPress={() => {
                        setSelectedField(field === 'Toutes les catégories' ? '' : field);
                        setShowFieldModal(false);
                      }}
                    >
                      <Icon 
                        name={field === 'Toutes les catégories' ? 'view-grid' : getFieldIcon(field)} 
                        size={24} 
                        color={selectedField === field ? '#fff' : '#8a348a'} 
                      />
                      <Text style={[
                        styles.fieldItemText,
                        selectedField === field && styles.fieldItemTextSelected
                      ]}>
                        {field}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowFieldModal(false)}
                >
                  <Text style={styles.closeModalText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <BottomNavigationBar navigation={navigation} />
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeAreaHeader: {
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#000',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#8a348a',
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  companyList: {
    padding: 10,
  },
  companyCard: {
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardGradient: {
    borderRadius: 15,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldIcon: {
    marginRight: 10,
  },
  cardHeaderText: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  fieldName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  companyPreview: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewMore: {
    fontSize: 14,
    color: '#fff',
    marginRight: 5,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
  },
  detailsHeader: {
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
  },
  detailsField: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  detailsContent: {
    padding: 20,
  },
  detailsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8a348a',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  websiteIcon: {
    marginRight: 10,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C76B98',
    padding: 15,
    borderRadius: 25,
  },
  backIcon: {
    marginRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8a348a',
    textAlign: 'center',
    marginBottom: 20,
  },
  fieldsList: {
    maxHeight: 400,
  },
  fieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(138, 52, 138, 0.1)',
  },
  fieldItemSelected: {
    backgroundColor: '#8a348a',
  },
  fieldItemText: {
    fontSize: 16,
    color: '#8a348a',
    marginLeft: 15,
  },
  fieldItemTextSelected: {
    color: '#fff',
  },
  closeModalButton: {
    backgroundColor: '#8a348a',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  closeModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconContainer: {
    padding: 10,
  },
});

export default CompanyListScreen;