import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, BackHandler, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { toast } from 'sonner-native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleExit = () => {
    if (Platform.OS === 'web') {
      // For web, we can't actually exit the app, so we'll just show a message
      toast.info("Thanks for playing Brain Master!");
    } else {
      // For native platforms, we can exit the app
      BackHandler.exitApp();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(1000)} style={styles.content}>
        <Text style={styles.title}>Brain Master</Text>
        <Text style={styles.subtitle}>Challenge Your Mind</Text>
        
        <Image 
          source={{ uri: 'https://api.a0.dev/assets/image?text=colorful%20brain%20illustration%20modern%20minimal&aspect=1:1' }}
          style={styles.logo}
        />

        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.playButton}
            onPress={() => navigation.navigate('LevelSelect')}
          >
            <Text style={styles.playButtonText}>Play</Text>
            <MaterialCommunityIcons name="play" size={24} color="#fff" />
          </Pressable>
          
          <Pressable 
            style={styles.exitButton}
            onPress={handleExit}
          >
            <Text style={styles.exitButtonText}>Exit</Text>
            <MaterialCommunityIcons name="exit-to-app" size={24} color="#fff" />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
    borderRadius: 100,
  },
  buttonContainer: {
    gap: 15,
    alignItems: 'center',
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    gap: 10,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  exitButton: {
    flexDirection: 'row',
    backgroundColor: '#757575',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    gap: 10,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});