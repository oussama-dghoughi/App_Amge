import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const Body = () => {

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

// Handle Inscrivez-vous button press
const handleRegisterPress = () => {
  console.log('Inscrivez-vous button pressed');
  // Navigate to registration screen or handle logic here
};

// Image Carousel (Slide Images every 5 seconds)
const [currentIndex, setCurrentIndex] = useState(0);
const images = [
  require('../../assets/image1.jpeg'),
  require('../../assets/image1.png'),
  require('../../assets/image2.png'),
  require('../../assets/image3.png'), // Add more images here
];

useEffect(() => {
  const intervalId = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Slide to the next image
  }, 3000); // Change image every 2 seconds

  return () => clearInterval(intervalId); // Cleanup on component unmount
}, []);

return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
          {/* StatusBar */}
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />

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

          {/* Inscrivez-vous Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
            <Text style={styles.registerButtonText}>Inscrivez-vous</Text>
          </TouchableOpacity>

          {/* Image Box with Slideshow */}
          <View style={styles.imageBoxContainer}>
            <Image
              source={images[currentIndex]}
              style={styles.imageBox}
              resizeMode="contain" // Adjust the image to fit within the box
            />
          </View>

          {/* Statistics Section */}
          <View style={styles.statisticsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>+2200</Text>
              <Text style={styles.statLabel}>Visiteurs</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>+60</Text>
              <Text style={styles.statLabel}>entreprises</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>+5000 m²</Text>
              <Text style={styles.statLabel}>surface</Text>
            </View>
          </View>
          {/* Social Media Icons Block */}
        <View style={styles.socialMediaBlock}>
          <View style={styles.socialIconsContainer}>
            <TouchableOpacity onPress={() => console.log('Instagram pressed')}>
              <Icon name="instagram" size={20} color="#fff" style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Facebook pressed')}>
              <Icon name="facebook" size={20} color="#fff" style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('LinkedIn pressed')}>
              <Icon name="linkedin" size={20} color="#fff" style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Email pressed')}>
              <Icon name="envelope" size={20} color="#fff" style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>
    </SafeAreaProvider>
  );

};
const styles = StyleSheet.create({
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
      marginTop: 5,
    },
    countdownContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
    },
    timeBox: {
      width: 70,
      height: 70,
      backgroundColor: '#8a348a',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginHorizontal: 5,
    },
    timeText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    labelText: {
      fontSize: 12,
      color: '#fff',
      marginTop: 5,
    },
    registerButton: {
      marginTop: 50,
      paddingVertical: 20,
      paddingHorizontal: 30,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F08080',
      maxWidth: 200,
      alignSelf: 'center',
      shadowColor: '#F57F17',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    registerButtonText: {
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: '600',
      fontFamily: 'Josefin Sans',
    },
    imageBoxContainer: {
      marginTop: 30,
      width: 250,
      height: 150,
      overflow: 'hidden',
      borderRadius: 10,
      alignSelf: 'center',
    },
    imageBox: {
      width: '100%',
      height: '100%',
    },
    statisticsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
    },
    statBox: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#8a348a',
      marginHorizontal: 10,
    },
    statNumber: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    statLabel: {
      color: '#fff',
      fontSize: 14,
      marginTop: 5,
      textAlign: 'center',
    },
    socialMediaBlock: {
        position: 'absolute', // Keep the block at the bottom
        bottom: 0, // Align it to the bottom of the screen
        width: '100%', // Full width
        backgroundColor: '#8a348a', // Background color (adjust as needed)
        paddingVertical: 10, // Vertical padding for spacing
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        zIndex: 1, // Ensure it stays above the BottomNavigationBar
    },
    socialIconsContainer: {
        flexDirection: 'row', // Align icons in a horizontal row
        justifyContent: 'center', // Center icons horizontally
        alignItems: 'center', // Align icons vertically
    },
    socialIcon: {
        marginHorizontal: 20, // Add spacing between icons
        marginBottom: 5,
    },

  
  });
  
  export default Body;