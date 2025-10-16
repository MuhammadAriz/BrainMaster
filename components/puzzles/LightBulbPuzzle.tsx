import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import Animated, { FadeIn, useAnimatedStyle, withSequence, withTiming, useSharedValue } from 'react-native-reanimated';

interface LightBulbPuzzleProps {
  onComplete: () => void;
  config?: any;
}

export const LightBulbPuzzle: React.FC<LightBulbPuzzleProps> = ({ onComplete, config }) => {
  // Default to 5 bulbs in a row, can be overridden by config
  const numBulbs = config?.numBulbs || 5;
  
  // Initialize bulb states (all off)
  const [bulbStates, setBulbStates] = useState<boolean[]>(Array(numBulbs).fill(false));
  
  // Track number of taps
  const [taps, setTaps] = useState(0);
  
  // Animation value for bulb glow
  const glowIntensity = useSharedValue(0);

  // Check if all bulbs are on
  useEffect(() => {
    if (bulbStates.every(state => state === true)) {
      // All bulbs are on, puzzle is solved
      toast.success('You did it! All lights are on!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [bulbStates]);

  // Handle bulb tap
  const handleBulbPress = (index: number) => {
    setTaps(prev => prev + 1);
    
    // Animate the glow effect
    glowIntensity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 300 })
    );
    
    // Toggle this bulb and adjacent bulbs
    setBulbStates(prevStates => {
      const newStates = [...prevStates];
      
      // Toggle the tapped bulb
      newStates[index] = !newStates[index];
      
      // Toggle left adjacent bulb if it exists
      if (index > 0) {
        newStates[index - 1] = !newStates[index - 1];
      }
      
      // Toggle right adjacent bulb if it exists
      if (index < numBulbs - 1) {
        newStates[index + 1] = !newStates[index + 1];
      }
      
      return newStates;
    });
    
    // If all bulbs are turned off, reset the puzzle
    if (bulbStates.every(state => state === true)) {
      setTimeout(() => {
        setBulbStates(Array(numBulbs).fill(false));
        toast.error('Oops! All bulbs turned off. Try again!');
      }, 500);
    }
  };

  // Animated style for the glow effect
  const glowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: glowIntensity.value * 0.8,
    };
  });

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <Text style={styles.instruction}>Turn on all the bulbs!</Text>
      <Text style={styles.subInstruction}>Tapping one bulb toggles it and adjacent bulbs</Text>
      
      <View style={styles.bulbsContainer}>
        {bulbStates.map((isOn, index) => (
          <Pressable
            key={index}
            style={styles.bulbWrapper}
            onPress={() => handleBulbPress(index)}
          >
            <Animated.View style={[styles.bulb, isOn && styles.bulbOn, glowStyle]}>
              <MaterialCommunityIcons
                name={isOn ? 'lightbulb-on' : 'lightbulb-outline'}
                size={40}
                color={isOn ? '#FFD700' : '#888'}
              />
            </Animated.View>
          </Pressable>
        ))}
      </View>
      
      <Text style={styles.tapsCount}>Taps: {taps}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subInstruction: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 30,
    textAlign: 'center',
  },
  bulbsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  bulbWrapper: {
    margin: 10,
  },
  bulb: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#333',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 5,
  },
  bulbOn: {
    backgroundColor: '#444',
  },
  tapsCount: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});