import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Linking, 
  Image, 
  ScrollView 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Add this import
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';
const Localisation = () => {
  const openInMaps = () => {
    const latitude = 48.880933; // Replace with your location's latitude
    const longitude = 2.291183; // Replace with your location's longitude
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Localisation</Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 48.880933,
              longitude: 2.291183,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: 48.880933,
                longitude: 2.291183,
              }}
              title="Forum Horizons Maroc"
              description="6 Rue Jean Oestreicher, 75017 Paris"
            />
          </MapView>
        </View>

        {/* Button Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.address}>
            📍 Adresse: 6 Rue Jean Oestreicher, 75017 Paris
          </Text>
          <Button
            title="Get Directions"
            color="#8A2BE2"
            onPress={openInMaps}
          />
        </View>
      </ScrollView>

       {/* Safe Bottom Navigation */}
       <View style={styles.navBarContainer}>
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <BottomNavigationBar />
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Add space for bottom navigation
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Keep your existing other styles...
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginTop: 5,
  },
  mapContainer: {
    height: 400, // Set fixed height or keep flex if preferred
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  address: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Localisation;