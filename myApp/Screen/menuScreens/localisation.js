import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Clipboard, Platform, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const LOCATION = {
  latitude: 48.8852,
  longitude: 2.2889,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};
const PLACE_NAME = "Espace Champerret, Paris";
const PLACE_ADDRESS = "6 Rue Jean Oestreicher, 75017 Paris, France";

const openMaps = () => {
  const url = Platform.select({
    ios: `http://maps.apple.com/?daddr=${LOCATION.latitude},${LOCATION.longitude}`,
    android: `http://maps.google.com/?daddr=${LOCATION.latitude},${LOCATION.longitude}`,
  });
  Linking.openURL(url);
};

const copyAddress = () => {
  Clipboard.setString(PLACE_ADDRESS);
};

const LocalisationScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#8a348a", "#c76b98"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Localisation</Text>
      </LinearGradient>
      {/* Carte */}
      <MapView
        style={styles.map}
        initialRegion={LOCATION}
        customMapStyle={mapStyle}
        showsUserLocation={false}
        showsMyLocationButton={false}
        loadingEnabled
      >
        <Marker coordinate={LOCATION}>
          <View style={styles.markerWrap}>
            <LinearGradient colors={["#8a348a", "#c76b98"]} style={styles.markerGlow} />
            <View style={styles.markerIconWrap}>
              <Icon name="map-marker" size={36} color="#fff" style={{ textShadowColor: '#8a348a', textShadowRadius: 8 }} />
            </View>
          </View>
        </Marker>
      </MapView>
      {/* Carte info glassmorphism */}
      <Animatable.View animation="fadeInUp" delay={300} style={styles.infoCardAnim}>
        <BlurView intensity={60} tint="light" style={styles.infoCardGlass}>
          <Text style={styles.placeName}>{PLACE_NAME}</Text>
          <Text style={styles.placeAddress}>{PLACE_ADDRESS}</Text>
          <View style={styles.infoCardBtns}>
            <TouchableOpacity style={styles.infoBtn} onPress={openMaps}>
              <Icon name="location-arrow" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.infoBtnText}>Itinéraire</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.infoBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#8a348a' }]} onPress={copyAddress}>
              <Icon name="copy" size={18} color="#8a348a" style={{ marginRight: 8 }} />
              <Text style={[styles.infoBtnText, { color: '#8a348a' }]}>Copier l'adresse</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animatable.View>
    </View>
  );
};

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f2e6fa' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f2e6fa' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a348a' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', stylers: [{ color: '#fff' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  backBtn: {
    marginRight: 12,
    padding: 6,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerGlow: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#c76b98',
    opacity: 0.25,
    zIndex: 1,
  },
  markerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8a348a',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  infoCardAnim: {
    position: 'absolute',
    bottom: 32,
    left: width * 0.04,
    width: width * 0.92,
    zIndex: 10,
  },
  infoCardGlass: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 20,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 6,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a348a',
    marginBottom: 6,
    textAlign: 'center',
  },
  placeAddress: {
    fontSize: 15,
    color: '#444',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoCardBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8a348a',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#8a348a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  infoBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default LocalisationScreen;