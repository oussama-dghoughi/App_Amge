import React from 'react';
import { Platform } from 'react-native';

// Import platform-specific InteractiveMap
const InteractiveMap = Platform.select({
  web: () => require('../components/PlanModule/InteractiveMap.web').default,
  default: () => require('../components/PlanModule/InteractiveMap.native').default,
})();

const PlanScreen = ({ navigation }) => {
  return <InteractiveMap navigation={navigation} />;
};

export default PlanScreen;