import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import { ANIMATIONS } from '../../theme/styles';

const AnimatedView = ({ 
  children, 
  animation = 'fade', // fade, slideUp, slideDown, slideLeft, slideRight, scale
  delay = 0,
  duration = ANIMATIONS.timing.duration,
  style = {},
}) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: duration,
      delay: delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const getAnimationStyle = () => {
    switch (animation) {
      case 'fade':
        return {
          opacity: animatedValue,
        };
      case 'slideUp':
        return {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        };
      case 'slideDown':
        return {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
        };
      case 'slideLeft':
        return {
          opacity: animatedValue,
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        };
      case 'slideRight':
        return {
          opacity: animatedValue,
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
        };
      case 'scale':
        return {
          opacity: animatedValue,
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          }],
        };
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  return (
    <Animated.View style={[style, getAnimationStyle()]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedView; 