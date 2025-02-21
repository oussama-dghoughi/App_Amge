import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screen/HomeScreen';
import LoginScreen from './Screen/Connexion/LoginScreen';
import RegistrationScreen from './Screen/Connexion/RegistrationScreen';
import FindAccountScreen from './Screen/Connexion/FindAccount';
import ChangePasswordScreen from './Screen/Connexion/ChangePassword';
import CompanyListScreen from './Screen/CompaniesScreens/CompanyListScreen';
import Localisation from './Screen/menuScreens/localisation'; // Add this import
import Contact from './Screen/menuScreens/contact';
import FAQ from './Screen/menuScreens/FAQ';
import About from './Screen/menuScreens/About.js';
const Stack = createNativeStackNavigator();
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Settings  from './Screen/menuScreens/Settings';
import NotificationScreen from './Screen/menuScreens/Notifs';
const App = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        >
          <Stack.Screen 
            name="Home" 
            options={{ gestureEnabled: true, fullScreenGestureEnabled: true }}
          >
            {(props) => <HomeScreen {...props} isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />}
          </Stack.Screen>
          <Stack.Screen 
            name="CompanyList" 
            component={CompanyListScreen}
            options={{
            gestureEnabled: true, // Enable swipe back
            fullScreenGestureEnabled: true, // iOS: Swipe from edge
          }}
          />
            {/* Add Localisation screen */}
            <Stack.Screen 
            name="Settings" 
            component={Settings}
            options={{
            gestureEnabled: true, // Enable swipe back
            fullScreenGestureEnabled: true, // iOS: Swipe from edge
          }}
          />
          {/* Add Localisation screen */}
          <Stack.Screen 
            name="Localisation" 
            component={Localisation}
            options={{
            gestureEnabled: true, // Enable swipe back
            fullScreenGestureEnabled: true, // iOS: Swipe from edge
          }}
          />
          <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Se connecter' ,
                      gestureEnabled: true, // Enable swipe back
                      fullScreenGestureEnabled: true, // iOS: Swipe from edge
            }} 
          
        />
        <Stack.Screen
          name="FindAccount"
          component={FindAccountScreen}
          options={{ title: 'Find Account',
            gestureEnabled: true, // Enable swipe back
            fullScreenGestureEnabled: true, // iOS: Swipe from edge
            }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ title: 'Sign Up' ,
                    gestureEnabled: true, // Enable swipe back
                    fullScreenGestureEnabled: true, // iOS: Swipe from edge
          }}
        />
        <Stack.Screen
          name="Notifs"
          component={NotificationScreen}
          options={{ title: 'Notifs' ,
                    gestureEnabled: true, // Enable swipe back
                    fullScreenGestureEnabled: true, // iOS: Swipe from edge
          }}
        />
        <Stack.Screen 
            name="FAQ"
            options={{ gestureEnabled: true, fullScreenGestureEnabled: true }}
          >
            {(props) => <FAQ {...props} isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} />}
          </Stack.Screen>
          <Stack.Screen name="Contact" component={Contact} options={{
            gestureEnabled: true, // Enable swipe back
            fullScreenGestureEnabled: true, // iOS: Swipe from edge
          }}/>
          <Stack.Screen
          name="About"
          component={About}
          options={{ title: 'Se connecter' ,
                      gestureEnabled: true, // Enable swipe back
                      fullScreenGestureEnabled: true, // iOS: Swipe from edge
            }} 
          
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ title: 'ChangePassword' ,
                      gestureEnabled: true, // Enable swipe back
                      fullScreenGestureEnabled: true, // iOS: Swipe from edge
            }} 
          
        />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;