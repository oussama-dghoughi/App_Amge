import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ImageBackground } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/HomeScreen/Header';
import BottomNavigationBar from '../../components/HomeScreen/BottomNavigationBar';

const NOTIFS = ({navigation}) => {
  const [toggleStates, setToggleStates] = useState({
    notifications: false,
    notes: false,
    messages: false,
    mail: false,
  });

  const toggleSwitch = (key) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../../assets/BackGround.jpeg')}
        style={styles.background}
        imageStyle={{ opacity: 0.35 }}
      >
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <Header  navigation={navigation} />
        </SafeAreaView>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Rectangle 1 */}
            <View style={styles.rectangle}>
              <Text style={styles.rectangleText}>Autoriser des notifications</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#8A2BE2' }}
                thumbColor={toggleStates.notifications ? '#ffffff' : '#f4f3f4'}
                onValueChange={() => toggleSwitch('notifications')}
                value={toggleStates.notifications}
              />
            </View>

            {/* Section Title without Background and aligned to the left */}
            {toggleStates.notifications && (
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Catégories de notifications</Text>
              </View>
            )}

            {/* Rectangle 2 */}
            {toggleStates.notifications && (
              <View style={styles.rectangle}>
                <Text style={styles.rectangleText}>Notes</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#8A2BE2' }}
                  thumbColor={toggleStates.notes ? '#ffffff' : '#f4f3f4'}
                  onValueChange={() => toggleSwitch('notes')}
                  value={toggleStates.notes}
                />
              </View>
            )}

            {/* Rectangle 3 */}
            {toggleStates.notifications && (
              <View style={styles.rectangle}>
                <Text style={styles.rectangleText}>Messages</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#8A2BE2' }}
                  thumbColor={toggleStates.messages ? '#ffffff' : '#f4f3f4'}
                  onValueChange={() => toggleSwitch('messages')}
                  value={toggleStates.messages}
                />
              </View>
            )}

            {/* Rectangle 4 */}
            {toggleStates.notifications && (
              <View style={styles.rectangle}>
                <Text style={styles.rectangleText}>Mail</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#8A2BE2' }}
                  thumbColor={toggleStates.mail ? '#ffffff' : '#f4f3f4'}
                  onValueChange={() => toggleSwitch('mail')}
                  value={toggleStates.mail}
                />
              </View>
            )}
          </ScrollView>
          <BottomNavigationBar />
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  headerSafeArea: {
    backgroundColor: '#fff',
    zIndex: 2,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 20,
  },
  rectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rectangleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  sectionTitleContainer: {
    padding: 10,
    marginBottom: 10, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2', 
    textAlign: 'left', 
  },
});

export default NOTIFS;
