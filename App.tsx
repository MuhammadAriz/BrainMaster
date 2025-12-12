  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import { StyleSheet } from 'react-native';
  import { SafeAreaProvider } from 'react-native-safe-area-context';
  import { Toaster } from 'sonner-native';
  import HomeScreen from './screens/HomeScreen';
  import LevelSelectScreen from './screens/LevelSelectScreen';
  import GameLevelScreen from './screens/GameLevelScreen';
  
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
    return (
      <SafeAreaProvider style={styles.container}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
        <Toaster
          position="top-center"
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
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      userSelect: 'none',
    },
  });
