import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
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
        toast.info('Now repeat the pattern!');
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
      toast.error('Wrong pattern! Try again');
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
      <Text style={styles.instruction}>
        {showingDemo ? 'Watch the pattern...' : 'Now repeat the pattern!'}
      </Text>

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
              <MaterialCommunityIcons
                name={isSelected ? 'check' : 'circle-outline'}
                size={30}
                color="#fff"
              />
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
  topLeft: { top: 0, left: 0 },
  topRight: { top: 0, right: 0 },
  bottomLeft: { bottom: 0, left: 0 },
  bottomRight: { bottom: 0, right: 0 },
  selectedCell: {
    backgroundColor: '#4CAF50',
    borderColor: '#fff',
  },
  highlightedCell: {
    backgroundColor: '#2E7D32',
    borderColor: '#fff',
    borderWidth: 3,
  },
});