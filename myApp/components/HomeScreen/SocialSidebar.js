import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const SocialSidebar = () => {
  const socialLinks = [
    {
      icon: 'instagram',
      url: 'https://www.instagram.com/forumhorizonsmaroc/?hl=fr',
    },
    {
      icon: 'facebook',
      url: 'https://www.facebook.com/ForumHorizonsMaroc',
    },
    {
      icon: 'linkedin',
      url: 'https://www.linkedin.com/company/forumhorizonsmaroc/',
    },
    {
      icon: 'envelope',
      url: 'mailto:fhm@amge-caravane.com?subject=Demande%20d%27information&body=Bonjour%2C%20je%20voudrais%20avoir%20plus%20d%27informations%20concernant%20le%20Forum%20Horizons%20Maroc.',
    },
  ];

  const handlePress = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <View style={styles.socialSidebar}>
      <BlurView intensity={60} tint="light" style={styles.socialBlur}>
        <LinearGradient
          colors={['rgba(138, 52, 138, 0.95)', 'rgba(161, 60, 161, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.socialGradient}
        >
          {socialLinks.map((item) => (
            <TouchableOpacity 
              key={item.icon}
              style={styles.socialIconButton}
              onPress={() => handlePress(item.url)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  socialSidebar: {
    position: 'absolute',
    top: '50%',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 220,
    marginTop: -110, // to perfectly center
    zIndex: 999,
    elevation: 999,
  },
  socialBlur: {
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  socialGradient: {
    padding: 10,
    alignItems: 'center',
  },
  socialIconButton: {
    width: 40,
    height: 40,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default SocialSidebar;
