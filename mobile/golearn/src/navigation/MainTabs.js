import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Trophy, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../components/GameUI';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, 
        
        tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            marginLeft: 30,
            marginRight: 30,
            elevation: 5,
            backgroundColor: colors.white,
            borderRadius: 24,
            height: 65,
            borderWidth: 4,
            borderColor: colors.dark,
            
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 0,
            paddingBottom: 0, 
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && {...styles.activeIcon, transform: [{ translateY: -10 }]}]}>
              <Home 
                size={28} 
                color={focused ? colors.white : "#9CA3AF"} 
                strokeWidth={3}
              />
            </View>
          )
        }}
      />

      <Tab.Screen 
        name="LeaderboardTab" 
        component={LeaderboardScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && {...styles.activeIcon, transform: [{ translateY: -10 }]}]}>
              <Trophy 
                size={28} 
                color={focused ? colors.white : "#9CA3AF"} 
                strokeWidth={3}
              />
            </View>
          )
        }}
      />

      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && {...styles.activeIcon, transform: [{ translateY: -10 }]}]}>
              <User 
                size={28} 
                color={focused ? colors.white : "#9CA3AF"} 
                strokeWidth={3}
              />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    transform: [{ translateY: 10 }],
    transition: 'all 0.3s', 
  },
  activeIcon: {
    backgroundColor: colors.primary, 
    borderWidth: 2,
    borderColor: colors.dark,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
  }
});