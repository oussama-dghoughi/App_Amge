import { useState, useRef } from 'react';
import { Animated } from 'react-native';

const useMenu = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current; // Starts offscreen

  const handleMenuPress = () => {
    if (isMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMenuVisible(false));
    } else {
      setIsMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return { isMenuVisible, slideAnim, handleMenuPress };
};

export default useMenu;
