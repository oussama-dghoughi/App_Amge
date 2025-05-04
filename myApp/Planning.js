import Header from '../components/Header';
import React from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const PlanningItem = ({ time, title, description }) => (
  <View style={styles.planningItem}>
    <Text style={styles.planningTime}>{time}</Text>
    <Text style={styles.planningTitleItem}>{title}</Text>
    <Text style={styles.planningDescription}>{description}</Text>
  </View>
);

const Settings = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../assets/BackGround.jpeg')}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <Header navigation={navigation} />

          <ScrollView contentContainerStyle={styles.bodyContainer}>

            {/* Planning de la journée */}
            <View style={styles.banniereContainer}>
              <Text style={styles.planningTitle}>🗓️ Planning de la journée</Text>
            </View>

            <View style={styles.planningContainer}>
              <PlanningItem
                time="9h30 - 10h30"
                title="Conférence 1: Le Marché de l'Emploi en Afrique"
                description="Discussion sur les opportunités d'emploi et les tendances du marché dans les différents secteurs."
              />
              <PlanningItem
                time="10h30 - 12h00"
                title="Atelier Pratique: Rédiger un CV Impactant"
                description="Un atelier pour améliorer vos CV et les adapter aux exigences du marché."
              />
              <PlanningItem
                time="12h30 - 13h30"
                title="Conférence 2: Le Développement Personnel au Travail"
                description="Des conseils pour réussir votre développement personnel."
              />
              <PlanningItem
                time="16h30 - 17h30"
                title="Atelier: Simulation d'Entretiens"
                description="Préparez-vous à l'entretien d’embauche avec des simulations réalistes."
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
};



const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#A34392',
    width: '100%',
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bodyContainer: {
    alignItems: 'center', 
    paddingBottom: 30, 
  },
  
  banniereContainer: {
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: '#f5ebfb',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  planningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planningContainer: {
    width: '90%',
  },
  planningItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planningTime: {
    fontWeight: 'bold',
    color: '#A34392',
    marginBottom: 5,
  },
  planningTitleItem: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  planningDescription: {
    fontSize: 14,
    color: '#555',
  },

});

export default Planning ;
