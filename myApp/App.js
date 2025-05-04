import React, { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IntroScreen from './Screen/IntroScreen';
import HomeScreen from './Screen/HomeScreen';
import LoginScreen from './Screen/Connexion/LoginScreen';
import RegistrationScreen from './Screen/Connexion/RegistrationScreen';
import FindAccountScreen from './Screen/Connexion/FindAccount';
import ChangePasswordScreen from './Screen/Connexion/ChangePassword';
import CompanyListScreen from './Screen/CompaniesScreens/CompanyListScreen';
import Localisation from './Screen/menuScreens/localisation';
import Contact from './Screen/menuScreens/contact';
import FAQ from './Screen/menuScreens/FAQ';
import About from './Screen/menuScreens/About.js';
import Settings from './Screen/menuScreens/Settings';
import NotificationScreen from './Screen/menuScreens/Notifs';
import EditProfile from './Screen/menuScreens/EditProfile';
import PlanScreen from './Screen/PlanScreen';
import GuideForumScreen from './Screen/GuideForumScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const [token, introSeen] = await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('hasSeenIntro')
        ]);
        setUserToken(token);
        setHasSeenIntro(introSeen === 'true');
      } catch (error) {
        console.log('Erreur lors de la vérification du statut:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialState();
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const screenOptions = {
    headerShown: Platform.OS === 'web',
    gestureEnabled: Platform.OS !== 'web'
  };

  if (isLoading) {
    return null; // Ou un écran de chargement
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
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
            name="Login" 
            component={LoginScreen}
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
          <Stack.Screen name="Settings" component={Settings} options={{ title: 'Paramètres' }} />
          <Stack.Screen name="Localisation" component={Localisation} options={{ title: 'Localisation' }} />
          <Stack.Screen name="Registration" component={RegistrationScreen} options={{ title: "S'inscrire" }} />
          <Stack.Screen name="Notifs" component={NotificationScreen} options={{ title: 'Notifications' }} />
          <Stack.Screen 
            name="FAQ" 
            options={{ title: 'FAQ' }}
          >
            {(props) => <FAQ {...props} isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />}
          </Stack.Screen>
          <Stack.Screen name="Contact" component={Contact} options={{ title: 'Contact' }} />
          <Stack.Screen name="About" component={About} options={{ title: 'À propos' }} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Changer le mot de passe' }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Modifier mon profil' }} />
          <Stack.Screen name="FindAccount" component={FindAccountScreen} options={{ title: 'Retrouver mon compte' }} />
          <Stack.Screen name="Plan" component={PlanScreen} />
          <Stack.Screen name="GuideForum" component={GuideForumScreen} options={{ title: 'Guide Forum' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;