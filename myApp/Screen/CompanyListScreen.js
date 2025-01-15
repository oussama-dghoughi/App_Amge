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
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header.js';
import { companies } from '../data/companies';

const CompanyListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [showFieldModal, setShowFieldModal] = useState(false);

  const fields = ['Toutes les catégories', ...new Set(companies.map((company) => company.field))];

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesField =
      selectedField === '' || selectedField === 'Toutes les catégories' || company.field === selectedField;
    return matchesSearch && matchesField;
  });

  const renderCompanyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.companyItem}
      onPress={() => navigation.navigate('CompanyDetails', { company: item })}
    >
      <Text style={styles.companyName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../assets/BackGround.jpeg')}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <Header />

          <Text style={styles.mainText}>Liste des Entreprises</Text>

          {/* Search and Filter Row */}
          <View style={styles.searchFilterRow}>
            {/* Barre de recherche */}
            <TextInput
              style={styles.searchBar}
              placeholder="Rechercher une entreprise"
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* Bouton Filtre */}
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


          {/* Modal for selecting categories */}
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

          {/* Company List */}
          <FlatList
            data={filteredCompanies}
            keyExtractor={(item) => item.id}
            renderItem={renderCompanyItem}
            contentContainerStyle={styles.companyList}
          />
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
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
      flexDirection: 'row', // Aligner les éléments horizontalement
      alignItems: 'center', // Alignement vertical centré
      marginHorizontal: 20,
      marginTop: 20,
    },
    searchBar: {
      flex: 1, // Remplir l'espace disponible
      height: 40,
      borderColor: '#8a348a',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      color: '#000',
    },
    filterButton: {
      marginLeft: 10, // Espacement entre la barre de recherche et le bouton filtre
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
