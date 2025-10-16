import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import Animated, { FadeIn, useAnimatedStyle, withSequence, withTiming, useSharedValue } from 'react-native-reanimated';

interface NumberSeriesPuzzleProps {
  onComplete: () => void;
  config?: {
    series: number[];
    answer: number;
    options: number[];
  };
}

export const NumberSeriesPuzzle: React.FC<NumberSeriesPuzzleProps> = ({ onComplete, config }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Default config if none provided
  const defaultConfig = {
    series: [2, 4, 8, 16],
    answer: 32,
    options: [24, 28, 32, 64]
  };
  
  const { series, answer, options } = config || defaultConfig;
  
  // Animation values
  const scaleValue = useSharedValue(1);
  
  useEffect(() => {
    if (isCorrect) {
      // Delay to show the success state before completing
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);
  
  const handleOptionSelect = (option: number) => {
    setSelectedOption(option);
    setAttempts(prev => prev + 1);
    
    if (option === answer) {
      // Correct answer
      setIsCorrect(true);
      toast.success('Correct! You found the pattern!');
      
      // Animate the correct answer
      scaleValue.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    } else {
      // Wrong answer
      toast.error('Not quite right. Try again!');
      
      // Reset selection after a delay
      setTimeout(() => {
        setSelectedOption(null);
      }, 1000);
    }
  };
  
  // Animated style for the selected option
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }]
    };
  });
  
  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <Text style={styles.instruction}>Find the next number in the sequence:</Text>
      
      <View style={styles.seriesContainer}>
        {series.map((num, index) => (
          <View key={index} style={styles.numberBox}>
            <Text style={styles.seriesNumber}>{num}</Text>
          </View>
        ))}
        <View style={styles.questionBox}>
          <Text style={styles.questionMark}>?</Text>
        </View>
      </View>
      
      <Text style={styles.subInstruction}>Select the correct next number:</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Pressable
            key={index}
            style={[
              styles.optionBox,
              selectedOption === option && (isCorrect ? styles.correctOption : styles.selectedOption)
            ]}
            onPress={() => handleOptionSelect(option)}
            disabled={isCorrect}
          >
            {selectedOption === option && isCorrect && (
              <Animated.View style={[styles.checkIcon, animatedStyle]}>
                <MaterialCommunityIcons name="check" size={24} color="#fff" />
              </Animated.View>
            )}
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      
      <Text style={styles.attemptsText}>Attempts: {attempts}</Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  subInstruction: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  seriesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  numberBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    margin: 5,
  },
  questionBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 8,
    margin: 5,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  seriesNumber: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  questionMark: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  optionBox: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    margin: 10,
  },
  selectedOption: {
    backgroundColor: '#555',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  checkIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 2,
  },
  attemptsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});