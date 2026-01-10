import React from 'react';
import { Platform, View, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import IntroScreen from './Screen/IntroScreen';
import HomeScreen from './Screen/HomeScreen';
import CompanyListScreen from './Screen/CompaniesScreens/CompanyListScreen';
import Localisation from './Screen/menuScreens/localisation.index';
import Contact from './Screen/menuScreens/contact';
import FAQ from './Screen/menuScreens/FAQ';
import About from './Screen/menuScreens/About.js';
import Settings from './Screen/menuScreens/Settings';
import NotificationScreen from './Screen/menuScreens/Notifs';
import PlanScreen from './Screen/PlanScreen';
import GuideForumScreen from './Screen/GuideForumScreen';
import PlanningFHM from './Screen/PlanningFHM';
import LoginScreen from './Screen/Connexion/LoginScreen';
import RegistrationScreen from './Screen/Connexion/RegistrationScreen.js';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: Platform.OS !== "web",
            }}
            initialRouteName="Intro"
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Intro"
              component={IntroScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegistrationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />

            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
            >
              {(props) => <HomeScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="CompanyList">
              {props => <CompanyListScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="FAQ"
              options={{ title: 'FAQ' }}
            >
              {(props) => <FAQ {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Contact"
              component={Contact}
              options={{ title: "Contact" }}
            />
            <Stack.Screen
              name="About"
              component={About}
              options={{ title: "À propos" }}
            />
            <Stack.Screen name="Plan" component={PlanScreen} />
            <Stack.Screen
              name="GuideForum"
              component={GuideForumScreen}
              options={{ title: "Guide Forum" }}
            />
            <Stack.Screen
              name="PlanningFHM"
              component={PlanningFHM}
              options={{ title: "Planning FHM" }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
