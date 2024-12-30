import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ onMenuPress, onProfilePress }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Menu Icon */}
      <TouchableOpacity style={styles.iconContainer} onPress={onMenuPress}>
        <Ionicons name="menu" size={24} color="#7E57C2" />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require('../assets/logo.png')} // Ensure the path matches
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Profile Icon */}
      <TouchableOpacity style={styles.iconContainer} onPress={onProfilePress}>
        <Ionicons name="person" size={24} color="#7E57C2" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  iconContainer: {
    padding: 10,
  },
  logo: {
    height: 40,
    flex: 1,
    marginHorizontal: 10,
  },
});

export default Header;