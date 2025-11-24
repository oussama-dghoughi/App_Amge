import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import InteractiveMap from '../components/PlanModule/InteractiveMap';

const PlanScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header navigation={navigation} />

      <View style={styles.planContainer}>
        {/* Module Plan Interactif */}
        <InteractiveMap />
      </View>

      <BottomNavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  planContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default PlanScreen;
