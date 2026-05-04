import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { toast } from 'sonner-native';

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
  const [highlightedColor, setHighlightedColor] = useState<string | null>(null);
  
  // Default colors and sequence
  const colors = config?.colors || ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
  const correctSequence = config?.correctSequence || ['#FF0000', '#0000FF', '#FFFF00'];
  
  // Display the pattern at the start
  useEffect(() => {
    if (!showingPattern) return;

    if (patternIndex < correctSequence.length) {
      const timer = setTimeout(() => {
        setHighlightedColor(correctSequence[patternIndex]);
        
        // Hide highlight after 400ms
        setTimeout(() => {
          setHighlightedColor(null);
          setPatternIndex(prev => prev + 1);
        }, 400);
      }, 600);
      
      return () => clearTimeout(timer);
    } else {
      setShowingPattern(false);
      setPatternIndex(0);
      toast.success('Now repeat the pattern!');
    }
  }, [patternIndex, showingPattern]);

  const handleColorPress = (color: string) => {
    if (showingPattern) return;
    
    const newColors = [...selectedColors, color];
    setSelectedColors(newColors);

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
      }, 800);
    }
  };

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
              showingPattern && patternIndex === i && styles.activeSlot
            ]}
          />
        ))}
      </View>
      
      <View style={styles.colorPicker}>
        {colors.map((color) => {
          const isHighlighted = highlightedColor === color;
          return (
            <Pressable
              key={color}
              style={[
                styles.colorButton, 
                { backgroundColor: color },
                isHighlighted && styles.highlightedButton
              ]}
              onPress={() => handleColorPress(color)}
            >
              {isHighlighted && <View style={styles.glow} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    gap: 30,
  },
  instruction: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  selectedColors: {
    flexDirection: 'row',
    gap: 10,
  },
  colorSlot: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#555',
  },
  activeSlot: {
    borderColor: '#fff',
    borderWidth: 3,
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  highlightedButton: {
    transform: [{ scale: 1.15 }],
    borderWidth: 4,
    borderColor: '#fff',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  }
});