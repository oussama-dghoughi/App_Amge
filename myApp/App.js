import React from 'react';
import { Platform, View, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import IntroScreen from './Screen/IntroScreen';
import HomeScreen from './Screen/HomeScreen';
import CompanyListScreen from './Screen/CompaniesScreens/CompanyListScreen';
import Localisation from './Screen/menuScreens/localisation';
import Contact from './Screen/menuScreens/contact';
import FAQ from './Screen/menuScreens/FAQ';
import About from './Screen/menuScreens/About.js';
import Settings from './Screen/menuScreens/Settings';
import NotificationScreen from './Screen/menuScreens/Notifs';
import PlanScreen from './Screen/PlanScreen';
import GuideForumScreen from './Screen/GuideForumScreen';
import PlanningFHM from './Screen/PlanningFHM';
import Menu from './components/common/Menu';
import OffresScreen from './Screen/OffresScreens/OffreScreen.js';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [slideAnim] = React.useState(new Animated.Value(-300));

  const toggleMenu = () => {
    if (!isMenuVisible) {
      setIsMenuVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: -300,
        useNativeDriver: true,
      }).start(() => setIsMenuVisible(false));
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <Stack.Navigator 
            screenOptions={{
              headerShown: false,
              gestureEnabled: Platform.OS !== 'web'
            }}
            initialRouteName="Intro"
          >
            <Stack.Screen 
              name="Intro" 
              component={IntroScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Home" 
              options={{ headerShown: false }}
            >
              {(props) => <HomeScreen {...props} isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />}
            </Stack.Screen>
            <Stack.Screen name="CompanyList">
              {props => <CompanyListScreen {...props} openMenu={toggleMenu} />}
            </Stack.Screen>
            <Stack.Screen name="Offres">
              {props => <OffresScreen {...props} openMenu={toggleMenu} />}
            </Stack.Screen>
            <Stack.Screen name="Settings" component={Settings} options={{ title: 'Paramètres' }} />
            <Stack.Screen name="Localisation" component={Localisation} options={{ title: 'Localisation' }} />
            <Stack.Screen name="Notifs" component={NotificationScreen} options={{ title: 'Notifications' }} />
            <Stack.Screen 
              name="FAQ" 
              options={{ title: 'FAQ' }}
            >
              {(props) => <FAQ {...props} isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />}
            </Stack.Screen>
            <Stack.Screen name="Contact" component={Contact} options={{ title: 'Contact' }} />
            <Stack.Screen name="About" component={About} options={{ title: 'À propos' }} />
            <Stack.Screen name="Plan" component={PlanScreen} />
            <Stack.Screen name="GuideForum" component={GuideForumScreen} options={{ title: 'Guide Forum' }} />
            <Stack.Screen name="PlanningFHM" component={PlanningFHM} options={{ title: 'Planning FHM' }} />
          </Stack.Navigator>
          {/* Menu global */}
          <Menu isMenuVisible={isMenuVisible} slideAnim={slideAnim} handleMenuPress={toggleMenu} />
        </View>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;