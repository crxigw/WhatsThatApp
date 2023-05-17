import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './AppScreens/SignupScreen';
import LoginScreen from './AppScreens/LoginScreen';
import ChatScreen from './AppScreens/ChatScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ContactsScreen from './AppScreens/ContactsScreen';
import SettingsScreen from './AppScreens/SettingsScreen';
import BlockedScreen from './AppScreens/BlockedContacts';
import IndividualChat from './AppScreens/IndividualChat';
import {NavigationEvents} from 'react-navigation';

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
    <Tab.Navigator
    screenOptions={{headerShown: false}}>
      <Tab.Screen name='Contacts' component={ContactStack}/>
      <Tab.Screen name='Chats' component={ChatStack}/>
      <Tab.Screen name='Settings' component={SettingsScreen}/>
    </Tab.Navigator>
  )
}

function ContactStack() {
  return (
    <AuthStack.Navigator
    screenOptions={{headerShown: false}}>
      <AuthStack.Screen name='Contacts2' component={ContactsScreen}/>
      <AuthStack.Screen name='Blocklist' component={BlockedScreen}/>
    </AuthStack.Navigator>
  )
}

function ChatStack() {
  return(
    <AuthStack.Navigator
    screenOptions={{headerShown: false}}>
      <AuthStack.Screen name='Chatlist' component={ChatScreen}/>
      <AuthStack.Screen name='IndividalChat' component={IndividualChat}/>      
    </AuthStack.Navigator>
  )
}