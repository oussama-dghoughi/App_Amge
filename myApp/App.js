import React from 'react';
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
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen 
            name="CompanyList" 
            component={CompanyListScreen}
          />
          {/* Add Localisation screen */}
          <Stack.Screen 
            name="Localisation" 
            component={Localisation}
          />
          <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Se connecter' }} 
        />
        <Stack.Screen
          name="FindAccount"
          component={FindAccountScreen}
          options={{ title: 'Find Account' }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ title: 'Sign Up' }}
        />
          <Stack.Screen name="Contact" component={Contact} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;