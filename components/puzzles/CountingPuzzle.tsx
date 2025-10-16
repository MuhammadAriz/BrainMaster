import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { toast } from 'sonner-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CountingPuzzleProps {
  onComplete: () => void;
  config?: any;
}

export const CountingPuzzle: React.FC<CountingPuzzleProps> = ({ onComplete, config }) => {
  const [attempts, setAttempts] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  
  // Default correct answer is 13 triangles, can be overridden by config
  const correctAnswer = config?.correctAnswer || 13;
  
  // Numbers to choose from
  const numbers = config?.numbers || [8, 10, 13, 15, 18];

  const handleNumberPress = (number: number) => {
    setSelectedNumber(number);
    setAttempts(prev => prev + 1);
    
    if (number === correctAnswer) {
      toast.success('Correct! You found all the triangles!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      toast.error('Not quite! Look more carefully...');
      setTimeout(() => {
        setSelectedNumber(null);
      }, 1000);
      
      // Show hint after 3 failed attempts
      if (attempts === 2) {
        toast.info('Hint: Count the small, medium, and large triangles!');
      }
    }
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <Text style={styles.instruction}>How many triangles can you find?</Text>
      
      <View style={styles.triangleContainer}>
        <Svg height="220" width="220" viewBox="0 0 100 100">
          {/* Large outer triangle */}
          <Path
            d="M10,90 L50,10 L90,90 Z"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
          />
          
          {/* Medium triangles */}
          <Path
            d="M30,50 L50,10 L70,50 Z"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
          />
          <Path
            d="M10,90 L50,50 L30,90 Z"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
          />
          <Path
            d="M50,50 L70,90 L90,90 Z"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
          />
          
          {/* Small triangles */}
          <Path
            d="M30,50 L50,30 L50,50 Z"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
          />
          <Path
            d="M50,30 L70,50 L50,50 Z"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
          />
        </Svg>
      </View>
      
      <Text style={styles.subInstruction}>Select the total number of triangles:</Text>
      
      <View style={styles.numbersContainer}>
        {numbers.map((number) => (
          <Pressable
            key={number}
            style={[
              styles.numberButton,
              selectedNumber === number && styles.selectedNumber
            ]}
            onPress={() => handleNumberPress(number)}
          >
            <Text style={styles.numberText}>{number}</Text>
          </Pressable>
        ))}
      </View>
      
      {attempts > 0 && (
        <Text style={styles.attemptsText}>Attempts: {attempts}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  instruction: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subInstruction: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  triangleContainer: {
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 10,
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  numberButton: {
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  selectedNumber: {
    backgroundColor: '#4CAF50',
    borderColor: '#fff',
  },
  numberText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  attemptsText: {
    color: '#888',
    fontSize: 14,
    marginTop: 20,
  },
});