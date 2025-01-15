import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const CompanyDetailsScreen = ({ route, navigation }) => {
  const { company } = route.params;

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../assets/BackGround.jpeg')} // Replace with the correct path
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <Text style={styles.title}>{company.name}</Text>

          <Text style={styles.field}>• <Text style={styles.boldText}>Domaine:</Text> {company.field}</Text>

          <Text style={styles.details}>• <Text style={styles.boldText}>Description:</Text> {company.details}</Text>

          <View style={styles.infoContainerRowExpanded}>
            <Text style={styles.infoText}>• Pour plus d'infos, visitez notre site:</Text>
          </View>
          <View style={styles.bottomContainer}>
                      <TouchableOpacity style={styles.websiteButton}
                      onPress={() => Linking.openURL(company.website)}
                    >
                      <Text style={styles.websiteButtonText}>{company.name}</Text>
                      </TouchableOpacity>
                    </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
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
    padding: 10,
    justifyContent: 'flex-start',
    backgroundColor: 'transparent', // Background is handled by the ImageBackground
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
  infoContainerRowExpanded: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Josefin Sans',
  },
  websiteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#8a348a',
    borderRadius: 10,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
  },
  bottomContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#8a348a',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
  },
});

export default CompanyDetailsScreen;
