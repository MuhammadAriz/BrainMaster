import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  runOnJS
} from 'react-native-reanimated';

import HomeScreen from './screens/HomeScreen';
import LevelSelectScreen from './screens/LevelSelectScreen';
import GameLevelScreen from './screens/GameLevelScreen';
import { initializeAds } from './utils/adInit';

const { width, height } = Dimensions.get('window');

// Keep the splash screen visible while we fetch resources
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
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize Ads and any other resources
        await initializeAds();
        // Artificial delay for smooth feel (optional)
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide native splash and start JS animation
      SplashScreen.hideAsync();
      
      opacity.value = withTiming(0, {
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }, (finished) => {
        if (finished) {
          runOnJS(setSplashAnimationFinished)(true);
        }
      });
      
      scale.value = withTiming(0.9, {
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }
  }, [appIsReady]);

  const animatedSplashStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={styles.container}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
        
        {/* Premium Animated Splash Overlay */}
        {!splashAnimationFinished && (
          <Animated.View 
            pointerEvents="none" 
            style={[StyleSheet.absoluteFill, styles.splashOverlay, animatedSplashStyle]}
          >
            <Image 
              source={require('./assets/splash.png')}
              style={styles.splashImage}
              resizeMode="contain"
            />
          </Animated.View>
        )}

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
  splashOverlay: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  splashImage: {
    width: width * 0.7,
    height: width * 0.7,
  }
});
