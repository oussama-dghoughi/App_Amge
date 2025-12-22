import React, { useMemo, useState } from 'react';
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
  Image,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import Header from '../../components/HomeScreen/Header';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';
import { companies } from '../../data/companies';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const CompanyListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState(''); // '' = all
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fields = useMemo(
    () => ['Toutes les catégories', ...new Set(companies.map((c) => c.field))],
    []
  );

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(q);
      const matchesField =
        selectedField === '' ||
        selectedField === 'Toutes les catégories' ||
        company.field === selectedField;
      return matchesSearch && matchesField;
    });
  }, [searchQuery, selectedField]);

  const handleWebsitePress = (url) => {
    if (!url) return;
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const getFieldIcon = (field) => {
    const icons = {
      Banking: 'bank',
      Insurance: 'shield-check',
      Technology: 'laptop',
      Consulting: 'briefcase',
      Engineering: 'engine',
      Investment: 'chart-line',
      Construction: 'home',
      Telecommunications: 'phone',
      Energy: 'flash',
      Retail: 'store',
      Aviation: 'airplane',
      Mining: 'pickaxe',
      'Food & Beverage': 'food',
      Pharmaceuticals: 'medical-bag',
      Logistics: 'truck',
      Agriculture: 'sprout',
    };
    return icons[field] || 'office-building';
  };

  const renderCompanyItem = ({ item }) => (
    <TouchableOpacity style={styles.companyCard} onPress={() => setSelectedCompany(item)}>
      <LinearGradient
        colors={['#8a348a', '#C76B98']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          {item.logo ? (
            <Image source={item.logo} style={styles.companyLogo} resizeMode="contain" />
          ) : (
            <Icon name={getFieldIcon(item.field)} size={30} color="#fff" style={styles.fieldIcon} />
          )}

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
      {/* ✅ Full white status bar area (and dark icons) */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />

      {/* ✅ Background image behind EVERYTHING (header + content), but we hide it under a white header layer */}
      <ImageBackground
        source={require('../../assets/BackGround.jpeg')}
        style={styles.background}
        imageStyle={{ opacity: 0.85 }}
      >
        {/* ✅ White safe-area + white header zone (so background stays hidden there) */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeAreaHeaderWhite}>
          <View style={styles.headerWhite}>
            <Header navigation={navigation} />
          </View>
        </SafeAreaView>

        {/* Content area */}
        <View style={styles.content}>
          {selectedCompany ? (
            <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
              <LinearGradient colors={['#8a348a', '#C76B98']} style={styles.detailsHeader}>
                {selectedCompany.logo ? (
                  <Image source={selectedCompany.logo} style={styles.detailsLogo} resizeMode="contain" />
                ) : (
                  <Icon name={getFieldIcon(selectedCompany.field)} size={50} color="#fff" />
                )}

                <Text style={styles.detailsTitle}>{selectedCompany.name}</Text>
                <Text style={styles.detailsField}>{selectedCompany.field}</Text>
              </LinearGradient>

              <View style={styles.detailsContent}>
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>À propos</Text>
                  <Text style={styles.detailsText}>{selectedCompany.details}</Text>
                </View>

                {selectedCompany.website ? (
                  <TouchableOpacity
                    style={styles.websiteButton}
                    onPress={() => handleWebsitePress(selectedCompany.website)}
                  >
                    <Icon name="web" size={24} color="#fff" style={styles.websiteIcon} />
                    <Text style={styles.websiteButtonText}>Visiter le site web</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity style={styles.backButton} onPress={() => setSelectedCompany(null)}>
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

                <TouchableOpacity style={styles.filterButton} onPress={() => setShowFieldModal(true)}>
                  <Icon name="filter-variant" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={filteredCompanies}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderCompanyItem}
                contentContainerStyle={styles.companyList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>

        {/* Filter modal */}
        <Modal
          transparent
          visible={showFieldModal}
          animationType="slide"
          onRequestClose={() => setShowFieldModal(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Filtrer par secteur</Text>

              <ScrollView style={styles.fieldsList} showsVerticalScrollIndicator={false}>
                {fields.map((field, index) => {
                  const isSelected =
                    (field === 'Toutes les catégories' && selectedField === '') ||
                    selectedField === field;

                  return (
                    <TouchableOpacity
                      key={`${field}-${index}`}
                      style={[styles.fieldItem, isSelected && styles.fieldItemSelected]}
                      onPress={() => {
                        setSelectedField(field === 'Toutes les catégories' ? '' : field);
                        setShowFieldModal(false);
                      }}
                    >
                      <Icon
                        name={field === 'Toutes les catégories' ? 'view-grid' : getFieldIcon(field)}
                        size={24}
                        color={isSelected ? '#fff' : '#8a348a'}
                      />
                      <Text style={[styles.fieldItemText, isSelected && styles.fieldItemTextSelected]}>
                        {field}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowFieldModal(false)}>
                <Text style={styles.closeModalText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Bottom nav fixed (white) */}
        <View style={styles.bottomNavContainer}>
          <BottomNavigationBar navigation={navigation} />
        </View>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },

  /* ✅ White safe area + header (hides background behind header) */
  safeAreaHeaderWhite: {
    backgroundColor: '#fff',
  },
  headerWhite: {
    backgroundColor: '#fff',
    width: '100%',
  },

  /* main content takes remaining space ABOVE bottom nav */
  content: {
    flex: 1,
    paddingBottom: 80, // space for bottom nav
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
  searchIcon: { marginRight: 10 },
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
    paddingBottom: 20,
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
  fieldIcon: { marginRight: 10 },
  cardHeaderText: { flex: 1 },

  companyLogo: {
    width: 42,
    height: 42,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
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
    marginTop: 10,
  },
  detailsHeader: {
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  detailsLogo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
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
  websiteIcon: { marginRight: 10 },
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
  backIcon: { marginRight: 10 },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Modal
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

  // Bottom nav fixed
  bottomNavContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
});

export default CompanyListScreen;
