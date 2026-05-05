import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import HomeScreen from './screens/HomeScreen';
import LevelSelectScreen from './screens/LevelSelectScreen';
import GameLevelScreen from './screens/GameLevelScreen';
import { initializeAds } from './utils/adInit';

// Keep the splash screen visible while we fetch resources
// This MUST be called before any component renders
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LevelSelect" component={LevelSelectScreen} />
      <Stack.Screen name="GameLevel" component={GameLevelScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    async function prepare() {
      try {
        await initializeAds();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={styles.container}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
        <Toaster
          position="bottom-center"
          duration={2000}
          closeButton={true}
          visibleToasts={1}
          toastOptions={{
            styles: {
              error: {
                backgroundColor: '#4E0A0A',
                borderWidth: 1,
                borderColor: '#FF6B6B',
              },
              title: {
                color: 'white',
              },
            },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: 'none',
  },
});
