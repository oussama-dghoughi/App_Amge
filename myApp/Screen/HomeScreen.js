import React from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import Body from '../components/HomeScreen/Body';
import SocialSidebar from '../components/HomeScreen/SocialSidebar';
const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Header navigation={navigation} />

        {/* Background Image */}
        <ImageBackground
          source={require('../assets/BackGround.jpeg')}
          style={styles.background}
          imageStyle={{ opacity: 0.3 }}
        >          
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <Body />
          </ScrollView>
        </ImageBackground>
        <SocialSidebar />
        {/* Fixed Bottom Navigation */}
        <View style={styles.bottomNavContainer}>
          <BottomNavigationBar />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  bodyContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 30,

  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,  // Adjust based on your BottomNavigationBar height
    backgroundColor: '#fff',
    elevation: 5,  // Shadow effect for Android
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5,
  },
});

export default HomeScreen;