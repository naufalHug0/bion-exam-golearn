import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CustomAlert from './src/components/CustomAlert';
import { View } from 'lucide-react-native';
import { colors } from './src/components/GameUI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import SubjectDetailScreen from './src/screens/SubjectDetailScreen';
import MaterialViewScreen from './src/screens/MaterialViewScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainTabs from './src/navigation/MainTabs';
import BookmarkScreen from './src/screens/BookmarkScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [initialRoute, setInitialRoute] = useState('Login');

    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync({
                'PlusJakartaSans-Regular': require('@expo-google-fonts/plus-jakarta-sans/400Regular/PlusJakartaSans_400Regular.ttf'),
            'PlusJakartaSans-Medium': require('@expo-google-fonts/plus-jakarta-sans/500Medium/PlusJakartaSans_500Medium.ttf'),
            'PlusJakartaSans-SemiBold': require('@expo-google-fonts/plus-jakarta-sans/600SemiBold/PlusJakartaSans_600SemiBold.ttf'),
            'PlusJakartaSans-Bold': require('@expo-google-fonts/plus-jakarta-sans/700Bold/PlusJakartaSans_700Bold.ttf'),
            'PlusJakartaSans-ExtraBold': require('@expo-google-fonts/plus-jakarta-sans/800ExtraBold/PlusJakartaSans_800ExtraBold.ttf'),
                });

                const token = await AsyncStorage.getItem('user_token');
                if (token) {
                setInitialRoute('MainApp');
                }
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    if (!appIsReady) {
        return (
        <View style={{ flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        );
    }

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack.Navigator 
            initialRouteName={initialRoute} 
            screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />

                <Stack.Screen name="MainApp" component={MainTabs} />
                <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
                <Stack.Screen name="MaterialView" component={MaterialViewScreen} />
                <Stack.Screen name="Bookmark" component={BookmarkScreen} />
            </Stack.Navigator>
            </GestureHandlerRootView>

            <CustomAlert />
        </SafeAreaProvider>
    );
}