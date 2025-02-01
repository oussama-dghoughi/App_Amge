import React, { useState } from 'react';
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
  Linking
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/HomeScreen/Header.js';
import { companies } from '../../data/companies.js';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar.js';

const CompanyListScreen = ({ navigation }) => { 
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

  const renderCompanyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.companyItem}
      onPress={() => setSelectedCompany(item)}
    >
      <Text style={styles.companyName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../../assets/BackGround.jpeg')}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
      <SafeAreaView style={styles.safeAreaHeader} edges={['top', 'left', 'right']}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          
          {/* Header */}
          <View style={styles.headerContainer}>
            <Header />
          </View>
        </SafeAreaView>
        <SafeAreaView style={styles.container} edges={['left', 'right']}>


          {selectedCompany ? (
            // Company Details View
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{selectedCompany.name}</Text>

              <Text style={styles.field}>
                {'\u2022'} <Text style={styles.boldText}>Domaine:</Text> {selectedCompany.field}
              </Text>

              <Text style={styles.details}>
                {'\u2022'} <Text style={styles.boldText}>Description:</Text> {selectedCompany.details}
              </Text>

              {selectedCompany.website && (
                <TouchableOpacity
                  style={styles.websiteButton}
                  onPress={() => handleWebsitePress(selectedCompany.website)}
                >
                  <Text style={styles.websiteButtonText}>Visiter le site web</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedCompany(null)}
              >
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Company List View
            <>
              <Text style={styles.mainText}>Liste des Entreprises</Text>

              {/* Search and Filter Row */}
              <View style={styles.searchFilterRow}>
                <TextInput
                  style={styles.searchBar}
                  placeholder="Rechercher une entreprise"
                  placeholderTextColor="#aaa"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setShowFieldModal(true)}
                >
                  <Text style={styles.filterButtonText}>
                    {selectedField === '' || selectedField === 'Toutes les catégories'
                      ? 'Catégories'
                      : selectedField}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Company List */}
              <FlatList
                data={filteredCompanies}
                keyExtractor={(item) => item.id}
                renderItem={renderCompanyItem}
                contentContainerStyle={styles.companyList}
              />
            </>
          )}

          {/* Category Modal */}
          <Modal
            transparent={true}
            visible={showFieldModal}
            animationType="slide"
            onRequestClose={() => setShowFieldModal(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Choisissez une catégorie</Text>
                <ScrollView style={styles.fieldsList}>
                  {fields.map((field, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.fieldItem}
                      onPress={() => {
                        setSelectedField(field === 'Toutes les catégories' ? '' : field);
                        setShowFieldModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.fieldItemText,
                          selectedField === field && styles.fieldItemTextSelected,
                        ]}
                      >
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
        </SafeAreaView>
        <BottomNavigationBar navigation={navigation} />
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeAreaHeader: {
    backgroundColor: '#fff', // White background for the status bar area
  },
  HeaderContainer: {
    backgroundColor: '#fff', // White background for the status bar area
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
  mainText: {
    color: '#8a348a',
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 20,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#8a348a',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#000',
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#8a348a',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  companyList: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  companyItem: {
    padding: 15,
    backgroundColor: '#8a348a',
    borderRadius: 10,
    marginBottom: 10,
  },
  companyName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Details Screen Styles
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 45,
    textAlign: 'center',
    fontFamily: 'Josefin Sans',
    fontStyle: 'italic',
  },
  field: {
    fontSize: 20,
    color: '#8a348a',
    marginBottom: 15,
    textAlign: 'left',
    fontFamily: 'Josefin Sans',
    fontStyle: 'italic',
  },
  details: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
    lineHeight: 26,
    textAlign: 'left',
    fontFamily: 'Josefin Sans',
  },
  boldText: {
    fontWeight: 'bold',
  },
  websiteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#8a348a',
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#8a348a',
    borderRadius: 10,
    marginTop: 30,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 20,
  },
  fieldsList: {
    width: '100%',
    maxHeight: 300,
  },
  fieldItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  fieldItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  fieldItemTextSelected: {
    color: '#8a348a',
    fontWeight: 'bold',
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#8a348a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeModalText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CompanyListScreen;