import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

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
  
  const defaultConfig = {
    series: [2, 4, 8, 16],
    answer: 32,
    options: [24, 28, 32, 64]
  };
  
  const { series, answer, options } = config || defaultConfig;
  
  useEffect(() => {
    if (isCorrect) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);
  
  const handleOptionSelect = (option: number) => {
    if (isCorrect) return;
    
    setSelectedOption(option);
    setAttempts(prev => prev + 1);
    
    if (option === answer) {
      setIsCorrect(true);
      toast.success('Correct! You found the pattern!');
    } else {
      toast.error('Not quite right. Try again!');
      setTimeout(() => {
        setSelectedOption(null);
      }, 1000);
    }
  };
  
  return (
    <View style={styles.container}>
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
              <View style={styles.checkIcon}>
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
              </View>
            )}
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
      
      <Text style={styles.attemptsText}>Attempts: {attempts}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  subInstruction: {
    fontSize: 15,
    color: '#aaa',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  seriesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  numberBox: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
  },
  questionBox: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  seriesNumber: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  questionMark: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  optionBox: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    position: 'relative',
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
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  checkIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 2,
    zIndex: 1,
  },
  attemptsText: {
    fontSize: 14,
    color: '#888',
    marginTop: 25,
  },
});