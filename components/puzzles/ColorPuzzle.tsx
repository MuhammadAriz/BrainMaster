import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import Animated, { FadeIn, useAnimatedStyle, withSequence, withTiming, useSharedValue } from 'react-native-reanimated';

interface ColorPuzzleProps {
  onComplete: () => void;
  config?: {
    colors?: string[];
    correctSequence?: string[];
  };
}

export const ColorPuzzle: React.FC<ColorPuzzleProps> = ({ onComplete, config }) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showingPattern, setShowingPattern] = useState(true);
  const [patternIndex, setPatternIndex] = useState(0);
  
  // Default colors and sequence if not provided in config
  const colors = config?.colors || ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
  const correctSequence = config?.correctSequence || ['#FF0000', '#0000FF', '#FFFF00'];
  
  // Animation value for highlighting
  const highlight = useSharedValue(0);

  // Show the pattern at the start
  useEffect(() => {
    // Display the pattern sequence
    const showPattern = () => {
      if (patternIndex < correctSequence.length) {
        // Highlight the current color in the sequence
        highlight.value = withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 300 })
        );
        
        // Move to the next color after a delay
        setTimeout(() => {
          setPatternIndex(patternIndex + 1);
        }, 800);
      } else {
        // Pattern display complete
        setShowingPattern(false);
        setPatternIndex(0);
        toast.info('Now repeat the pattern!');
      }
    };
    
    if (showingPattern) {
      showPattern();
    }
  }, [patternIndex, showingPattern]);

  const handleColorPress = (color: string) => {
    if (showingPattern) return; // Don't allow input while showing pattern
    
    const newColors = [...selectedColors, color];
    setSelectedColors(newColors);

    // Check if the sequence is correct so far
    const isCorrectSoFar = newColors.every((c, i) => c === correctSequence[i]);
    
    if (!isCorrectSoFar) {
      toast.error('Wrong color! Try again');
      setSelectedColors([]);
      return;
    }

    if (newColors.length === correctSequence.length) {
      toast.success('Correct pattern!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  // Animated style for the highlighted color
  const highlightStyle = useAnimatedStyle(() => {
    return {
      opacity: highlight.value * 0.7 + 0.3,
      transform: [{ scale: highlight.value * 0.2 + 1 }],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {showingPattern ? 'Watch the pattern...' : 'Now repeat the pattern!'}
      </Text>
      
      <View style={styles.selectedColors}>
        {Array.from({ length: correctSequence.length }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.colorSlot,
              selectedColors[i] && { backgroundColor: selectedColors[i] },
              showingPattern && patternIndex === i && { borderColor: '#fff', borderWidth: 3 }
            ]}
          />
        ))}
      </View>
      
      <View style={styles.colorPicker}>
        {colors.map((color) => (
          <Pressable
            key={color}
            style={[
              styles.colorButton, 
              { backgroundColor: color },
              showingPattern && correctSequence[patternIndex] === color && { transform: [{ scale: 1.2 }] }
            ]}
            onPress={() => handleColorPress(color)}
          >
            {showingPattern && correctSequence[patternIndex] === color && (
              <Animated.View 
                style={[
                  StyleSheet.absoluteFill, 
                  { backgroundColor: color, borderRadius: 20 },
                  highlightStyle
                ]} 
              />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    gap: 40,
  },
  instruction: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedColors: {
    flexDirection: 'row',
    gap: 10,
  },
  colorSlot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#555',
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 15,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});