import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface WordPuzzleProps {
  onComplete: () => void;
  config?: {
    word?: string;
    target?: string;
    type?: 'anagram' | 'wordsearch' | 'wordchain';
    grid?: string[][];
    chain?: string[];
  };
}

export const WordPuzzle: React.FC<WordPuzzleProps> = ({ onComplete, config }) => {
  const startWord = config?.word || 'RATS';
  const targetWord = config?.target || 'STAR';
  const puzzleType = config?.type || 'anagram';
  const validChain = config?.chain || [];
  
  const [currentWord, setCurrentWord] = useState(startWord.split(''));
  const [steps, setSteps] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [chainWords, setChainWords] = useState<string[]>([startWord]);
  const [inputWord, setInputWord] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(4);
  
  // Animation values
  const rotation = useSharedValue(0);
  
  // Check if the word matches the target
  useEffect(() => {
    if (currentWord.join('') === targetWord) {
      toast.success('Great job! You transformed the word!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [currentWord]);

  // Check if the chain is complete
  useEffect(() => {
    if (chainWords.length > 1 && chainWords[chainWords.length - 1] === targetWord) {
      toast.success('Great job! You completed the word chain!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [chainWords]);

  // Handle letter tap for anagram
  const handleLetterPress = (index: number) => {
    if (selectedIndices.length === 0) {
      // First selection
      setSelectedIndices([index]);
    } else if (selectedIndices.length === 1) {
      // Second selection - swap letters
      const firstIndex = selectedIndices[0];
      
      if (firstIndex === index) {
        // Deselect if tapping the same letter
        setSelectedIndices([]);
        return;
      }
      
      // Swap the letters
      const newWord = [...currentWord];
      const temp = newWord[firstIndex];
      newWord[firstIndex] = newWord[index];
      newWord[index] = temp;
      
      // Update state
      setCurrentWord(newWord);
      setSelectedIndices([]);
      setSteps(prev => prev + 1);
      
      // Animate rotation
      rotation.value = withSpring(rotation.value + 360, { damping: 10 });
    }
  };

  // Handle word chain submission
  const handleWordChainSubmit = () => {
    if (!inputWord) {
      toast.error('Please enter a word');
      return;
    }

    // Check if only one letter is different
    const lastWord = chainWords[chainWords.length - 1];
    let differentLetters = 0;
    
    if (inputWord.length !== lastWord.length) {
      toast.error('Word must be the same length');
      setAttempts(prev => prev + 1);
      return;
    }
    
    for (let i = 0; i < lastWord.length; i++) {
      if (lastWord[i] !== inputWord[i].toUpperCase()) {
        differentLetters++;
      }
    }
    
    if (differentLetters !== 1) {
      toast.error('You can only change one letter at a time');
      setAttempts(prev => prev + 1);
      return;
    }
    
    // Check if the word is in the valid chain
    if (validChain.includes(inputWord.toUpperCase())) {
      // Add the word to the chain
      setChainWords([...chainWords, inputWord.toUpperCase()]);
      setInputWord('');
      toast.success('Good job! Keep going!');
    } else {
      toast.error('Not a valid word in this chain');
      setAttempts(prev => prev + 1);
    }
    
    // Check if max attempts reached
    if (attempts >= maxAttempts - 1) {
      toast.error(`You've used all ${maxAttempts} attempts!`);
      // Show hint
      Alert.alert(
        'Hint',
        `Try this sequence: ${validChain.join(' → ')}`,
        [{ text: 'OK' }]
      );
    }
  };

  // Animated style for letter rotation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotation.value}deg` }],
    };
  });

  // Render anagram puzzle
  const renderAnagramPuzzle = () => (
    <View style={styles.wordContainer}>
      {currentWord.map((letter, index) => (
        <Pressable
          key={index}
          style={[
            styles.letterBox,
            selectedIndices.includes(index) && styles.selectedLetter
          ]}
          onPress={() => handleLetterPress(index)}
        >
          <Animated.Text 
            style={[styles.letterText, animatedStyle]}
          >
            {letter}
          </Animated.Text>
        </Pressable>
      ))}
    </View>
  );

  // Render word search puzzle
  const renderWordSearchPuzzle = () => {
    if (!config?.grid) return null;
    
    return (
      <View style={styles.gridContainer}>
        {config.grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((letter, colIndex) => (
              <Pressable
                key={`${rowIndex}-${colIndex}`}
                style={styles.gridCell}
                onPress={() => {/* Handle grid cell press */}}
              >
                <Text style={styles.gridCellText}>{letter}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Render word chain puzzle
  const renderWordChainPuzzle = () => (
    <View style={styles.chainContainer}>
      <View style={styles.chainWordsContainer}>
        {chainWords.map((word, index) => (
          <View key={index} style={styles.chainWordBox}>
            <Text style={styles.chainWordText}>{word}</Text>
            {index < chainWords.length - 1 && (
              <MaterialCommunityIcons name="arrow-right" size={24} color="#4CAF50" />
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.wordInput}
          value={inputWord}
          onChangeText={setInputWord}
          placeholder="Enter next word..."
          placeholderTextColor="#777"
          maxLength={4}
          autoCapitalize="characters"
        />
        <Pressable 
          style={styles.submitButton}
          onPress={handleWordChainSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </Pressable>
      </View>
      
      <Text style={styles.attemptsText}>
        Attempts: {attempts}/{maxAttempts}
      </Text>
    </View>
  );

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <Text style={styles.instruction}>
        {puzzleType === 'wordchain' 
          ? `Transform "${startWord}" into "${targetWord}" one letter at a time`
          : `Transform "${startWord}" into "${targetWord}"`
        }
      </Text>
      <Text style={styles.subInstruction}>
        {puzzleType === 'wordchain' 
          ? 'Change one letter at a time to form valid words'
          : 'Tap two letters to swap their positions'
        }
      </Text>
      
      {puzzleType === 'anagram' && renderAnagramPuzzle()}
      {puzzleType === 'wordsearch' && renderWordSearchPuzzle()}
      {puzzleType === 'wordchain' && renderWordChainPuzzle()}
      
      <View style={styles.infoContainer}>
        {puzzleType !== 'wordchain' && <Text style={styles.stepsText}>Steps: {steps}</Text>}
        <Text style={styles.targetText}>Target: {targetWord}</Text>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subInstruction: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 30,
    textAlign: 'center',
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  letterBox: {
    width: 60,
    height: 60,
    backgroundColor: '#333',
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  selectedLetter: {
    borderColor: '#4CAF50',
    backgroundColor: '#444',
  },
  letterText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  stepsText: {
    color: '#aaa',
    fontSize: 16,
  },
  targetText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gridContainer: {
    marginVertical: 20,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  gridCellText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chainContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  chainWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  chainWordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  chainWordText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  wordInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    width: 150,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#444',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  attemptsText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 10,
  },
});