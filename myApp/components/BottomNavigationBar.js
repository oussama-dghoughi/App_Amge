import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNavigationBar = () => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="home" size={24} color="#9b59b6" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="map-marker" size={24} color="#9b59b6" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.iconContainer, styles.qrIcon]}>
        <Icon name="qrcode-scan" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="notebook" size={24} color="#9b59b6" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="calendar" size={24} color="#9b59b6" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, // Shadow appears above
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Shadow for Android
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
  },
  qrIcon: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default BottomNavigationBar;
