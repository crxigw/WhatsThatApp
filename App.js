import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './AppScreens/SignupScreen';
import LoginScreen from './AppScreens/LoginScreen';
import ChatScreen from './AppScreens/ChatScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ContactsScreen from './AppScreens/ContactsScreen';
import SettingsScreen from './AppScreens/SettingsScreen';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthStack.Navigator initialRouteName='Login'
      screenOptions={{headerShown: false}}>
        <AuthStack.Screen name='Login' component={LoginScreen} />
        <AuthStack.Screen name='Create Account' component={SignUpScreen} />
        <AuthStack.Screen name='AppTabNavi' component={InAppTabNavi}/>
      </AuthStack.Navigator>
    </NavigationContainer>
  )
}

function InAppTabNavi() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Contacts' component={ContactsScreen}/>
      <Tab.Screen name='Chat' component={ChatScreen}/>
      <Tab.Screen name='Settings' component={SettingsScreen}/>
    </Tab.Navigator>
  )
}
