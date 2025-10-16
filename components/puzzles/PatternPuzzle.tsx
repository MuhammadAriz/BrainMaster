import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withSequence, withTiming, useSharedValue } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

interface PatternPuzzleProps {
  onComplete: () => void;
  config?: {
    correctPattern?: number[];
  };
}

export const PatternPuzzle: React.FC<PatternPuzzleProps> = ({ onComplete, config }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  // Default pattern is clockwise: top-left, top-right, bottom-right, bottom-left
  const correctPattern = config?.correctPattern || [0, 1, 3, 2];
  
  const [showingDemo, setShowingDemo] = useState(true);
  const [demoIndex, setDemoIndex] = useState(-1);
  
  // Animation value for highlighting
  const highlight = useSharedValue(0);
  
  // Show the pattern demonstration at start
  useEffect(() => {
    if (showingDemo) {
      if (demoIndex < correctPattern.length - 1) {
        // Highlight the next position in the pattern
        setTimeout(() => {
          setDemoIndex(demoIndex + 1);
          highlight.value = withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0, { duration: 300 })
          );
        }, 800);
      } else {
        // Demo complete
        setTimeout(() => {
          setShowingDemo(false);
          setDemoIndex(-1);
          toast.info('Now repeat the pattern!');
        }, 1000);
      }
    }
  }, [demoIndex, showingDemo]);

  const handlePress = (index: number) => {
    if (showingDemo) return; // Don't allow input during demo
    
    const newPattern = [...pattern, index];
    setPattern(newPattern);
    
    // Check if the pattern is correct so far
    const isCorrectSoFar = newPattern.every((val, i) => val === correctPattern[i]);
    
    if (!isCorrectSoFar) {
      toast.error('Wrong pattern! Try again');
      setPattern([]);
      return;
    }

    if (newPattern.length === correctPattern.length) {
      toast.success('Correct pattern!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };
  
  // Animated style for the highlighted cell
  const highlightStyle = useAnimatedStyle(() => {
    return {
      opacity: highlight.value * 0.7 + 0.3,
      transform: [{ scale: highlight.value * 0.2 + 1 }],
    };
  });

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <Text style={styles.instruction}>
        {showingDemo ? 'Watch the pattern...' : 'Now repeat the pattern!'}
      </Text>
      
      <View style={styles.grid}>
        {Array.from({ length: 4 }).map((_, index) => {
          const isHighlighted = showingDemo && correctPattern[demoIndex] === index;
          const isSelected = pattern.includes(index);
          
          return (
            <Pressable
              key={index}
              style={[
                styles.cell,
                isSelected && styles.selectedCell,
                // Position cells in a 2x2 grid
                index === 0 && styles.topLeft,
                index === 1 && styles.topRight,
                index === 2 && styles.bottomLeft,
                index === 3 && styles.bottomRight,
              ]}
              onPress={() => handlePress(index)}
            >
              {isHighlighted && (
                <Animated.View 
                  style={[
                    StyleSheet.absoluteFill, 
                    { backgroundColor: '#4CAF50', borderRadius: 10 },
                    highlightStyle
                  ]} 
                />
              )}
              <MaterialCommunityIcons
                name={isSelected ? 'check' : 'circle-outline'}
                size={30}
                color="#fff"
              />
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  cell: {
    width: 90,
    height: 90,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#555',
    overflow: 'hidden',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  selectedCell: {
    backgroundColor: '#4CAF50',
    borderColor: '#fff',
  },
});