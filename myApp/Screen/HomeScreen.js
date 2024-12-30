import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header.js'; // Assurez-vous que le chemin vers Header est correct

const HomeScreen = () => {
  const handleMenuPress = () => {
    console.log('Menu button pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile buttonx pressed');
  };

  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState(360000); // Example: 4 days countdown (360000 seconds)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000); // Update countdown every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  // Format time (DD:HH:MM:SS)
  const formatTime = (time) => {
    const days = Math.floor(time / (3600 * 24));
    const hours = Math.floor((time % (3600 * 24)) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../assets/BackGround.jpeg')} // Replace with your image path
        style={styles.background}
        imageStyle={{ opacity: 0.3 }} // Adjust opacity as needed
      >
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
          {/* StatusBar */}
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />

          {/* Header */}
          <Header onMenuPress={handleMenuPress} onProfilePress={handleProfilePress} />

          {/* Main Text */}
          <Text style={styles.mainText}>Forum Horizons Maroc 2025</Text>

          {/* Countdown Timer */}
          <View style={styles.countdownContainer}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{days}</Text>
              <Text style={styles.labelText}>Days</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{hours}</Text>
              <Text style={styles.labelText}>Hours</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{minutes}</Text>
              <Text style={styles.labelText}>Minutes</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{seconds}</Text>
              <Text style={styles.labelText}>Seconds</Text>
            </View>
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
  },
  mainText: {
    color: '#8a348a',
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 20, // Create space below the header
  },
  countdownContainer: {
    flexDirection: 'row', // Horizontal layout for the countdown
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  timeBox: {
    width: 70,
    height: 70,
    backgroundColor: '#8a348a', // Purple box color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text inside box
  },
  labelText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
});

export default HomeScreen;
