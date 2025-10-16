import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface LogicPuzzleProps {
  onComplete: () => void;
  config?: any;
}

export const LogicPuzzle: React.FC<LogicPuzzleProps> = ({ onComplete, config }) => {
  const [selected, setSelected] = useState<number | null>(null);

  // Default grid of items (can be overridden by config)
  const items = config?.items || [
    { id: 1, shape: 'circle', color: '#FF5252' },
    { id: 2, shape: 'circle', color: '#FF5252' },
    { id: 3, shape: 'circle', color: '#FF5252' },
    { id: 4, shape: 'square', color: '#FF5252' }, // This is the odd one
    { id: 5, shape: 'circle', color: '#FF5252' },
    { id: 6, shape: 'circle', color: '#FF5252' },
    { id: 7, shape: 'circle', color: '#FF5252' },
    { id: 8, shape: 'circle', color: '#FF5252' },
    { id: 9, shape: 'circle', color: '#FF5252' }
  ];

  const correctAnswer = config?.answer || 4; // Default to item 4 (the square)

  const handleSelect = (id: number) => {
    setSelected(id);
    
    if (id === correctAnswer) {
      toast.success('Correct!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      toast.error('Try again!');
      setTimeout(() => {
        setSelected(null);
      }, 1000);
    }
  };

  const renderShape = (item) => {
    if (item.shape === 'circle') {
      return <View style={[styles.shape, { borderRadius: 25, backgroundColor: item.color }]} />;
    } else if (item.shape === 'square') {
      return <View style={[styles.shape, { backgroundColor: item.color }]} />;
    } else if (item.shape === 'triangle') {
      return (
        <View style={styles.triangleContainer}>
          <View style={[styles.triangle, { borderBottomColor: item.color }]} />
        </View>
      );
    } else {
      // Default to circle
      return <View style={[styles.shape, { borderRadius: 25, backgroundColor: item.color }]} />;
    }
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <Text style={styles.instruction}>Find the odd one out:</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.item,
              selected === item.id && styles.selectedItem
            ]}
            onPress={() => handleSelect(item.id)}
          >
            {renderShape(item)}
          </Pressable>
        ))}
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
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 240,
  },
  item: {
    width: 70,
    height: 70,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#444',
  },
  selectedItem: {
    borderColor: '#4CAF50',
    backgroundColor: '#333',
  },
  shape: {
    width: 50,
    height: 50,
  },
  triangleContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  }
});