import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import Animated from 'react-native-reanimated';

interface PatternPuzzleProps {
  onComplete: () => void;
  config?: {
    correctPattern?: number[];
  };
}

export const PatternPuzzle: React.FC<PatternPuzzleProps> = ({ onComplete, config }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const correctPattern = config?.correctPattern || [0, 1, 3, 2];

  const [showingDemo, setShowingDemo] = useState(true);
  const [demoIndex, setDemoIndex] = useState(-1);
  // Track which cell is currently highlighted (no Animated.View needed)
  const [highlightedCell, setHighlightedCell] = useState<number | null>(null);

  // Show the pattern demonstration at start — using plain setTimeout + state
  useEffect(() => {
    if (!showingDemo) return;

    if (demoIndex < correctPattern.length - 1) {
      const nextIndex = demoIndex + 1;
      const timer = setTimeout(() => {
        setDemoIndex(nextIndex);
        setHighlightedCell(correctPattern[nextIndex]);
        // Unhighlight after 500ms
        setTimeout(() => setHighlightedCell(null), 500);
      }, 800);
      return () => clearTimeout(timer);
    } else if (demoIndex === correctPattern.length - 1) {
      const timer = setTimeout(() => {
        setShowingDemo(false);
        setDemoIndex(-1);
        setHighlightedCell(null);
        toast.success('Now repeat the pattern!');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [demoIndex, showingDemo]);

  const handlePress = (index: number) => {
    if (showingDemo) return;

    const newPattern = [...pattern, index];
    setPattern(newPattern);

    const isCorrectSoFar = newPattern.every((val, i) => val === correctPattern[i]);

    if (!isCorrectSoFar) {
      setPattern([]);
      return;
    }

    if (newPattern.length === correctPattern.length) {
      toast.success('Correct pattern!');
      setTimeout(() => {
        onComplete();
      }, 800);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {Array.from({ length: 4 }).map((_, index) => {
          const isHighlighted = highlightedCell === index;
          const isSelected = pattern.includes(index);

          return (
            <Pressable
              key={index}
              style={[
                styles.cell,
                isSelected && styles.selectedCell,
                isHighlighted && styles.highlightedCell,
                index === 0 && styles.topLeft,
                index === 1 && styles.topRight,
                index === 2 && styles.bottomLeft,
                index === 3 && styles.bottomRight,
              ]}
              onPress={() => handlePress(index)}
            >
               <Animated.View style={[
                  styles.innerCell,
                  isHighlighted && styles.pulseEffect
                ]}>
                <MaterialCommunityIcons
                  name={isSelected ? 'star' : 'circle-medium'}
                  size={isSelected ? 40 : 25}
                  color={isSelected ? "#FFD700" : "#555"}
                />
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
      
      {/* Decorative background elements */}
      <View style={styles.glow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  grid: {
    width: 220,
    height: 220,
    position: 'relative',
  },
  cell: {
    width: 100,
    height: 100,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#333',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  innerCell: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  topLeft: { top: 0, left: 0 },
  topRight: { top: 0, right: 0 },
  bottomLeft: { bottom: 0, left: 0 },
  bottomRight: { bottom: 0, right: 0 },
  selectedCell: {
    backgroundColor: '#2E7D32',
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  highlightedCell: {
    backgroundColor: '#455A64',
    borderColor: '#607D8B',
    borderWidth: 4,
    transform: [{ scale: 1.05 }],
  },
  pulseEffect: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    zIndex: -1,
  }
});