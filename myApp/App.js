import React from 'react';
import HomeScreen from './Screen/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import CompanyListScreen from './Screen/CompanyListScreen';
import CompanyDetailsScreen from './Screen/CompanyDetailsScreen';
import { StatusBar } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Company-related screens
const CompanyStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="CompanyList"
      component={CompanyListScreen}
      options={{ title: 'Liste des Entreprises' }}
    />
    <Stack.Screen
      name="CompanyDetails"
      component={CompanyDetailsScreen}
      options={({ route }) => ({
        title: route.params?.company?.name || 'Détails de l’entreprise',
      })}
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Drawer.Navigator initialRouteName="Companies" screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Companies" component={CompanyStack} />
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
