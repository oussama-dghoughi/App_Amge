import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ImageBackground, FlatList,
  TextInput, TouchableOpacity, Modal, ScrollView, Linking,
  Dimensions, Platform, LayoutAnimation, UIManager, ActivityIndicator, RefreshControl
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons as Icon } from '@expo/vector-icons';

// Components
import Header from '../../components/HomeScreen/Header.js';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar.js';

// API Service
import { offerService } from '../../services/api.js'; 

const { width, height } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OffreScreen = ({ navigation, openMenu }) => {
  // --- ÉTATS (UI + API) ---
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSecteur, setSelectedSecteur] = useState('Toutes les offres');
  const [showSecteurModal, setShowSecteurModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // --- LOGIQUE DES ICÔNES (CORRIGÉE) ---
  const getFieldIcon = (field) => {
    const icons = { 
        'Banking': 'bank', 
        'Technology': 'laptop', 
        'Consulting': 'briefcase', 
        'Insurance': 'shield-check' 
    };
    // Correction: on utilise 'office-building' pour éviter le warning "building"
    return icons[field] || 'office-building';
  };

  // --- CHARGEMENT DES DONNÉES DEPUIS L'API ---
  const fetchOffres = async () => {
    try {
      setLoading(true);
      const response = await offerService.getOffers();
      // On gère le format de réponse { success: true, data: [...] }
      const data = response.data || response;
      setOffres(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("Erreur API Offres:", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOffres();
  };

  // --- LOGIQUE DYNAMIQUE DES SECTEURS ---
  const secteurs = ['Toutes les offres', ...new Set(offres.map((offer) => offer.secteur))];

  // --- LOGIQUE DE FILTRAGE ---
  const filteredOffres = offres.filter((offer) => {
    const itemId = offer.id || offer._id;
    const matchesSearch = 
        offer.description?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.companyId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSecteur = selectedSecteur === 'Toutes les offres' || offer.secteur === selectedSecteur;
    const matchesFavorites = showOnlyFavorites ? favorites.includes(itemId) : true;
    
    return matchesSearch && matchesSecteur && matchesFavorites;
  });

  // --- FONCTION TOGGLE FAVORIS ---
  const toggleFavorite = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // --- RENDERS ---

  const renderCategoryChips = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
      <TouchableOpacity
        onPress={() => {
            setShowOnlyFavorites(!showOnlyFavorites);
            if (!showOnlyFavorites) setSelectedSecteur('Toutes les offres');
        }}
        style={[styles.chip, showOnlyFavorites && styles.chipFavoriteSelected]}
      >
        <Ionicons 
            name={showOnlyFavorites ? "heart" : "heart-outline"} 
            size={16} 
            color={showOnlyFavorites ? "#fff" : "#FF4B4B"} 
        />
        <Text style={[styles.chipText, showOnlyFavorites && styles.chipTextSelected, {marginLeft: 5}]}>
          Favoris
        </Text>
      </TouchableOpacity>

      {/* Affichage du secteur sélectionné s'il y en a un */}
      {selectedSecteur !== 'Toutes les offres' && (
        <View style={[styles.chip, styles.chipSelected]}>
            <Text style={[styles.chipText, styles.chipTextSelected]}>{selectedSecteur}</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderOffreItem = ({ item }) => {
    const itemId = item.id || item._id;
    const isFav = favorites.includes(itemId);

    return (
      <TouchableOpacity style={styles.newCard} onPress={() => setSelectedOffre(item)} activeOpacity={0.9}>
        <View style={styles.cardInfo}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBox}>
               <Icon name={getFieldIcon(item.secteur)} size={24} color="#8a348a" />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.companyTitle}>{item.companyId}</Text>
              <Text style={styles.jobType}>{item.title}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(itemId)} style={styles.heartButton}>
                <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#FF4B4B" : "#ccc"} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.descriptionSnippet} numberOfLines={2}>{item.description}</Text>

          <View style={styles.cardFooterRow}>
            <View style={styles.salaryBadge}><Text style={styles.salaryText}>{item.salary || "N/A"}</Text></View>
            <Text style={styles.detailsLink}>Voir plus <Icon name="chevron-right" size={14} /></Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <View style={styles.mainContainer}>
        <StatusBar barStyle="dark-content" />
        <Header navigation={navigation} openMenu={openMenu} />

        {selectedOffre ? (
          <View style={styles.fullDetailContainer}>
             <View style={styles.detailHeaderActions}>
                <TouchableOpacity onPress={() => setSelectedOffre(null)} style={styles.circleBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavorite(selectedOffre.id || selectedOffre._id)} style={styles.circleBtn}>
                    <Ionicons 
                        name={favorites.includes(selectedOffre.id || selectedOffre._id) ? "heart" : "heart-outline"} 
                        size={24} 
                        color={favorites.includes(selectedOffre.id || selectedOffre._id) ? "#FF4B4B" : "#fff"} 
                    />
                </TouchableOpacity>
             </View>

            <ScrollView bounces={false}>
              <LinearGradient colors={['#8a348a', '#C76B98']} style={styles.detailHeaderGradient}>
                <View style={styles.detailIconCircle}>
                   <Icon name={getFieldIcon(selectedOffre.secteur)} size={50} color="#8a348a" />
                </View>
                <Text style={styles.detailCompany}>{selectedOffre.companyId}</Text>
                <Text style={styles.detailSubtitle}>{selectedOffre.title}</Text>
              </LinearGradient>

              <View style={styles.detailBody}>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Icon name="cash" size={20} color="#8a348a" />
                        <Text style={styles.infoText}>{selectedOffre.salary || "N/A"}</Text>
                    </View>
                </View>
                <Text style={styles.detailSectionTitle}>À propos de l'offre</Text>
                <Text style={styles.detailDescText}>{selectedOffre.description}</Text>
                
                <TouchableOpacity style={styles.applyButton} onPress={() => Linking.openURL(selectedOffre.website)}>
                  <Text style={styles.applyButtonText}>Postuler via le site</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        ) : (
          <ImageBackground source={require('../../assets/BackGround.jpeg')} style={styles.background} imageStyle={{ opacity: 0.1 }}>
            <View style={styles.searchSection}>
              <View style={styles.searchWrapper}>
                <Icon name="magnify" size={22} color="#8a348a" />
                <TextInput
                  style={styles.newInput}
                  placeholder="Rechercher une offre..."
                  placeholderTextColor={'#666'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowSecteurModal(true)}
              >
                <Icon name="filter-variant" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {renderCategoryChips()}

            {loading && !refreshing ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#8a348a" />
              </View>
            ) : (
              <FlatList
                data={filteredOffres}
                keyExtractor={(item) => (item.id || item._id).toString()}
                renderItem={renderOffreItem}
                contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 15 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Icon name={showOnlyFavorites ? "heart-broken" : "magnify-close"} size={60} color="#ccc" />
                    <Text style={styles.emptyText}>
                      {showOnlyFavorites ? "Vous n'avez pas encore de favoris." : "Aucune offre trouvée."}
                    </Text>
                  </View>
                }
              />
            )}
          </ImageBackground>
        )}

        <Modal
          transparent={true}
          visible={showSecteurModal}
          animationType="slide"
          onRequestClose={() => setShowSecteurModal(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Filtrer par secteur</Text>
              <ScrollView style={styles.fieldsList}>
                {secteurs.map((secteur, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.fieldItem,
                      selectedSecteur === secteur && styles.fieldItemSelected
                    ]}
                    onPress={() => {
                      setSelectedSecteur(secteur);
                      setShowOnlyFavorites(false);
                      setShowSecteurModal(false);
                    }}
                  >
                    <Icon 
                      name={secteur === 'Toutes les offres' ? 'view-grid' : getFieldIcon(secteur)} 
                      size={24} 
                      color={selectedSecteur === secteur ? '#fff' : '#8a348a'} 
                    />
                    <Text style={[
                      styles.fieldItemText,
                      selectedSecteur === secteur && styles.fieldItemTextSelected
                    ]}>
                      {secteur}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowSecteurModal(false)}
              >
                <Text style={styles.closeModalText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <BottomNavigationBar navigation={navigation} />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  background: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Search & Chips
  searchSection: { flexDirection: 'row', padding: 15, paddingBottom: 5, gap:10 },
  searchWrapper: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 12,
    height: 45, elevation: 2
  },
  newInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  chipsContainer: { paddingLeft: 15, marginVertical: 15, maxHeight: 50 },
  chip: { 
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
    height: 35, borderRadius: 18, backgroundColor: '#fff', marginRight: 10, 
    borderWidth: 1, borderColor: '#eee', elevation: 1
  },
  chipSelected: { backgroundColor: '#8a348a', borderColor: '#8a348a' },
  chipFavoriteSelected: { backgroundColor: '#FF4B4B', borderColor: '#FF4B4B' },
  chipText: { color: '#666', fontWeight: '600', fontSize: 13 },
  chipTextSelected: { color: '#fff' },

  // Cards
  newCard: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
    padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F3E5F5', justifyContent: 'center', alignItems: 'center' },
  titleContainer: { flex: 1, marginLeft: 12 },
  companyTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  jobType: { fontSize: 12, color: '#8a348a', marginTop: 2 },
  heartButton: { padding: 5 },
  descriptionSnippet: { color: '#777', fontSize: 13, lineHeight: 18, marginVertical: 12 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  salaryBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  salaryText: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold' },
  detailsLink: { color: '#8a348a', fontWeight: 'bold', fontSize: 12 },

  // Details
  fullDetailContainer: { flex: 1, backgroundColor: '#fff' },
  detailHeaderActions: { 
    position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10, 
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 
  },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  detailHeaderGradient: { padding: 50, paddingTop: 80, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  detailIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  detailCompany: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 15 },
  detailSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 5 },
  detailBody: { padding: 25 },
  infoRow: { marginBottom: 20 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { marginLeft: 10, fontSize: 16, color: '#333', fontWeight: '500' },
  detailSectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  detailDescText: { fontSize: 15, color: '#666', lineHeight: 22 },
  applyButton: { backgroundColor: '#8a348a', padding: 16, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#999', marginTop: 10 },

  // Modal
  filterButton: {
    backgroundColor: '#8a348a',
    width: 45, height: 45,
    borderRadius: 23,
    justifyContent: 'center', alignItems: 'center',
    elevation: 3,
  },
  modalBackground: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9, backgroundColor: '#fff',
    borderRadius: 20, padding: 20, maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20, fontWeight: 'bold',
    color: '#8a348a', textAlign: 'center', marginBottom: 20,
  },
  fieldsList: { maxHeight: 400 },
  fieldItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 15, marginVertical: 5, borderRadius: 12,
    backgroundColor: 'rgba(138, 52, 138, 0.1)',
  },
  fieldItemSelected: { backgroundColor: '#8a348a' },
  fieldItemText: { fontSize: 16, color: '#8a348a', marginLeft: 15 },
  fieldItemTextSelected: { color: '#fff' },
  closeModalButton: {
    backgroundColor: '#8a348a', padding: 15,
    borderRadius: 25, marginTop: 20,
  },
  closeModalText: {
    color: '#fff', fontSize: 16,
    fontWeight: 'bold', textAlign: 'center',
  }
});

export default OffreScreen;
