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
  const [bulbTapsTrack, setBulbTapsTrack] = useState<number[]>(Array(numBulbs).fill(0));
  
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
    
    // Animate the glow effect briefly for feedback
    glowIntensity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );

    const isWarmUpBulb = config?.warmUpBulbs ? config.warmUpBulbs.includes(index) : !!config?.warmUpTaps;
    const checkIsWarmUp = (i: number) => config?.warmUpBulbs ? config.warmUpBulbs.includes(i) : !!config?.warmUpTaps;

    if (isWarmUpBulb && config?.warmUpTaps) {
      setBulbTapsTrack(prev => {
        const newTaps = [...prev];
        newTaps[index] += 1;
        
        if (newTaps[index] >= config.warmUpTaps) {
          setBulbStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = true;
            return newStates;
          });
        }
        return newTaps;
      });
      return; // Skip normal toggle logic for this bulb
    }
    
    // Normal toggle logic: Toggle this bulb and adjacent bulbs
    setBulbStates(prevStates => {
      const newStates = [...prevStates];
      
      // Toggle the tapped bulb
      newStates[index] = !newStates[index];
      
      // Toggle left adjacent bulb if it exists and is not a warm up bulb
      if (index > 0 && !checkIsWarmUp(index - 1)) {
        newStates[index - 1] = !newStates[index - 1];
      }
      
      // Toggle right adjacent bulb if it exists and is not a warm up bulb
      if (index < numBulbs - 1 && !checkIsWarmUp(index + 1)) {
        newStates[index + 1] = !newStates[index + 1];
      }
      
      return newStates;
    });
    
    // If all bulbs are turned off (after being modified), reset the puzzle?
    // This is optional, but let's fix the logical check just in case.
    if (bulbStates.every(state => state === false) && taps > 0) {
      // It was true but that means they were all ON.
      // The intention might have been checking if it's dead, but let's just leave it out to not interfere with normal gameplay.
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
                size={32}
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
    margin: 6,
  },
  bulb: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
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