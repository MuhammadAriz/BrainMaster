import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface MathPuzzleProps {
  onComplete: () => void;
  config?: {
    numbers?: number[];
    target?: number;
    type?: 'equation' | 'emoji';
    equations?: { emoji: string[], result: number }[];
    solution?: Record<string, number>;
  };
}

export const MathPuzzle: React.FC<MathPuzzleProps> = ({ onComplete, config }) => {
  const puzzleType = config?.type || 'equation';
  const numbers = config?.numbers || [1, 3, 4, 6];
  const target = config?.target || 10;
  
  const [equation, setEquation] = useState<(number | string)[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [userSolution, setUserSolution] = useState<Record<string, string>>({});
  const [solvedEmojis, setSolvedEmojis] = useState<string[]>([]);
  
  const scale = useSharedValue(1);
  
  const operators = ['+', '-', '×', '÷'];
  
  useEffect(() => {
    if (equation.length > 0) {
      try {
        const evalEquation = equation
          .map(item => typeof item === 'string' ? item.replace('×', '*').replace('÷', '/') : item)
          .join('');
        
        const calculatedResult = eval(evalEquation);
        setResult(calculatedResult);
        
        if (calculatedResult === target && selectedNumbers.length === numbers.length) {
          scale.value = withSpring(1.2, { damping: 10 });
          setTimeout(() => {
            scale.value = withSpring(1);
          }, 300);
          
          toast.success(`Great job! You made ${target}!`);
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
      } catch (error) {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [equation]);
  
  const handleNumberPress = (num: number) => {
    if (selectedNumbers.includes(num)) {
      const numIndex = selectedNumbers.indexOf(num);
      const newEquation = [...equation];
      
      let count = 0;
      let position = -1;
      
      for (let i = 0; i < newEquation.length; i++) {
        if (typeof newEquation[i] === 'number' && newEquation[i] === num) {
          if (count === numIndex) {
            position = i;
            break;
          }
          count++;
        }
      }
      
      if (position !== -1) {
        if (position > 0 && typeof newEquation[position - 1] === 'string') {
          newEquation.splice(position - 1, 2);
        } else if (position < newEquation.length - 1 && typeof newEquation[position + 1] === 'string') {
          newEquation.splice(position, 2);
        } else {
          newEquation.splice(position, 1);
        }
        
        setEquation(newEquation);
        setSelectedNumbers(selectedNumbers.filter((_, i) => i !== numIndex));
      }
    } else {
      const lastItem = equation[equation.length - 1];
      if (equation.length === 0 || typeof lastItem === 'string') {
        const newEquation = [...equation, num];
        setEquation(newEquation);
        setSelectedNumbers([...selectedNumbers, num]);
      } else {
        toast.error('An operator must be placed between numbers.');
      }
    }
  };
  
  const handleOperatorPress = (op: string) => {
    if (equation.length === 0) {
      toast.error('Please select a number first.');
      return;
    }
  
    const lastItem = equation[equation.length - 1];
  
    if (typeof lastItem === 'number') {
      const newEquation = [...equation, op];
      setEquation(newEquation);
    } else if (typeof lastItem === 'string') {
      const newEquation = [...equation];
      newEquation[equation.length - 1] = op;
      setEquation(newEquation);
    }
  };
  
  const handleClear = () => {
    setEquation([]);
    setSelectedNumbers([]);
    setResult(null);
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const renderEquationPuzzle = () => (
    <View style={styles.puzzleContainer}>
      <Text style={styles.numbersUsedText}>
        Numbers Used: {selectedNumbers.length} / {numbers.length}
      </Text>
      <View style={styles.equationContainer}>
        {equation.length > 0 ? (
          equation.map((item, index) => (
            <Text key={index} style={styles.equationText}>
              {item}
            </Text>
          ))
        ) : (
          <Text style={styles.placeholderText}>Select numbers to build equation</Text>
        )}
        
        {result !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.equalsText}>=</Text>
            <Animated.Text 
              style={[
                styles.resultText, 
                result === target && selectedNumbers.length === numbers.length ? styles.correctResult : styles.incorrectResult,
                animatedStyle
              ]}
            >
              {result}
            </Animated.Text>
          </View>
        )}
      </View>
      
      <View style={styles.numbersContainer}>
        {numbers.map((num) => (
          <Pressable
            key={num}
            style={[
              styles.numberButton,
              selectedNumbers.includes(num) && styles.selectedNumber
            ]}
            onPress={() => handleNumberPress(num)}
          >
            <Text style={styles.numberText}>{num}</Text>
          </Pressable>
        ))}
      </View>
      
      <View style={styles.operatorsContainer}>
        {operators.map((op) => (
          <Pressable
            key={op}
            style={styles.operatorButton}
            onPress={() => handleOperatorPress(op)}
          >
            <Text style={styles.operatorText}>{op}</Text>
          </Pressable>
        ))}
      </View>
      
      <Pressable style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearText}>Clear</Text>
      </Pressable>
    </View>
  );
  
  const renderEmojiPuzzle = () => {
    if (!config?.equations || !config?.solution) return null;

    const handleInputChange = (emoji: string, text: string) => {
        setUserSolution(prev => ({ ...prev, [emoji]: text }));
    };

    const checkSolution = () => {
        let allCorrect = true;
        const newSolvedEmojis: string[] = [];
        for (const emoji in config.solution) {
            if (parseInt(userSolution[emoji]) === config.solution[emoji]) {
                newSolvedEmojis.push(emoji);
            } else {
                allCorrect = false;
            }
        }
        setSolvedEmojis(newSolvedEmojis);

        if (allCorrect) {
            toast.success('Congratulations! You solved it!');
            setTimeout(() => {
                onComplete();
            }, 1000);
        } else if (newSolvedEmojis.length > 0) {
             toast.error('Some are correct. Keep trying!');
        } else {
            toast.error('Not quite, check your answers.');
        }
    };
    
    return (
      <View style={styles.emojiContainer}>
        {config.equations.map((eq, index) => (
          <View key={index} style={styles.emojiEquation}>
            {eq.emoji.map((emoji, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Text style={styles.emojiOperator}>+</Text>}
                <Text style={styles.emojiText}>{emoji}</Text>
              </React.Fragment>
            ))}
            <Text style={styles.emojiEquals}>=</Text>
            <Text style={styles.emojiResult}>{eq.result}</Text>
          </View>
        ))}
        
        <View style={styles.emojiSolution}>
          <Text style={styles.emojiQuestion}>What is the value of each emoji?</Text>
          
          {Object.keys(config.solution).map((emoji, index) => (
            <View key={index} style={styles.emojiValueRow}>
              <Text style={styles.emojiText}>{emoji}</Text>
              <Text style={styles.emojiEquals}>=</Text>
              <TextInput
                style={[
                    styles.emojiInput,
                    solvedEmojis.includes(emoji) && styles.correctInput
                ]}
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={(text) => handleInputChange(emoji, text)}
                value={userSolution[emoji] || ''}
              />
            </View>
          ))}
        </View>
        <Pressable style={styles.checkButton} onPress={checkSolution}>
            <Text style={styles.checkButtonText}>Check Answer</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <Text style={styles.instruction}>
        {puzzleType === 'equation' 
          ? `Create an equation that equals ${target} using all numbers provided`
          : 'Solve the emoji equations'}
      </Text>
      
      {puzzleType === 'equation' ? renderEquationPuzzle() : renderEmojiPuzzle()}
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
  puzzleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  equationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    minHeight: 60,
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  equationText: {
    color: '#fff',
    fontSize: 24,
    marginHorizontal: 5,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  equalsText: {
    color: '#fff',
    fontSize: 24,
    marginHorizontal: 5,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  correctResult: {
    color: '#4CAF50',
  },
  incorrectResult: {
    color: '#F44336',
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  numberButton: {
    width: 60,
    height: 60,
    backgroundColor: '#444',
    margin: 5,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
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
  operatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  operatorButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FF9800',
    margin: 5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  operatorText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  clearText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
   numbersUsedText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 10,
  },
  emojiContainer: {
    width: '100%',
    alignItems: 'center',
  },
  emojiEquation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
  },
  emojiText: {
    fontSize: 28,
    marginHorizontal: 5,
  },
  emojiOperator: {
    color: '#fff',
    fontSize: 24,
    marginHorizontal: 5,
  },
  emojiEquals: {
    color: '#fff',
    fontSize: 24,
    marginHorizontal: 10,
  },
  emojiResult: {
    color: '#4CAF50',
    fontSize: 28,
    fontWeight: 'bold',
  },
  emojiSolution: {
    marginTop: 30,
    alignItems: 'center',
  },
  emojiQuestion: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  emojiValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  emojiInput: {
    width: 60,
    height: 60,
    backgroundColor: '#444',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  correctInput: {
      borderColor: '#4CAF50',
      color: '#4CAF50',
  },
  checkButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginTop: 20,
  },
  checkButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
  },
  emojiValueButton: {
    width: 50,
    height: 50,
    backgroundColor: '#444',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
  },
  emojiValueText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
