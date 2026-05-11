import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

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
  const [isCorrect, setIsCorrect] = useState(false);
  
  useEffect(() => {
    if (currentWord.join('') === targetWord && !isCorrect) {
      setIsCorrect(true);
      toast.success('Great job! You transformed the word!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [currentWord]);

  useEffect(() => {
    if (chainWords.length > 1 && chainWords[chainWords.length - 1] === targetWord && !isCorrect) {
      setIsCorrect(true);
      toast.success('Great job! You completed the word chain!');
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [chainWords]);

  const handleLetterPress = (index: number) => {
    if (isCorrect) return;
    
    if (selectedIndices.length === 0) {
      setSelectedIndices([index]);
    } else if (selectedIndices.length === 1) {
      const firstIndex = selectedIndices[0];
      if (firstIndex === index) {
        setSelectedIndices([]);
        return;
      }
      
      const newWord = [...currentWord];
      const temp = newWord[firstIndex];
      newWord[firstIndex] = newWord[index];
      newWord[index] = temp;
      
      const newSteps = steps + 1;
      // Strict mode: if steps > 2 for RATS -> STAR, reset
      if (puzzleType === 'anagram' && startWord === 'RATS' && targetWord === 'STAR') {
        if (newSteps > 2) {
          // Silent reset as requested (no popup)
          setCurrentWord(startWord.split(''));
          setSteps(0);
          setSelectedIndices([]);
          return;
        }
      }

      setCurrentWord(newWord);
      setSelectedIndices([]);
      setSteps(newSteps);
    }
  };

  const handleWordChainSubmit = () => {
    if (isCorrect) return;
    if (!inputWord) {
      toast.error('Please enter a word');
      return;
    }

    const lastWord = chainWords[chainWords.length - 1];
    let differentLetters = 0;
    
    const cleanInput = inputWord.trim().toUpperCase();
    
    if (cleanInput.length !== lastWord.length) {
      toast.error('Word must be the same length');
      setAttempts(prev => prev + 1);
      return;
    }
    
    for (let i = 0; i < lastWord.length; i++) {
      if (lastWord[i] !== cleanInput[i]) {
        differentLetters++;
      }
    }
    
    if (differentLetters !== 1) {
      toast.error('Change exactly one letter');
      setAttempts(prev => prev + 1);
      return;
    }
    
    if (validChain.includes(cleanInput)) {
      setChainWords([...chainWords, cleanInput]);
      setInputWord('');
      toast.success('Good job!');
    } else {
      toast.error('Not a valid word in this chain');
      setAttempts(prev => prev + 1);
    }
    
    if (attempts >= maxAttempts - 1 && cleanInput !== targetWord) {
      Alert.alert('Hint', `Try: ${validChain.join(' → ')}`);
    }
  };

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
          <Text style={styles.letterText}>{letter}</Text>
        </Pressable>
      ))}
    </View>
  );

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
              >
                <Text style={styles.gridCellText}>{letter}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderWordChainPuzzle = () => (
    <View style={styles.chainContainer}>
      <View style={styles.chainWordsContainer}>
        {chainWords.map((word, index) => (
          <View key={index} style={styles.chainWordBox}>
            <Text style={styles.chainWordText}>{word}</Text>
            {index < chainWords.length - 1 && (
              <MaterialCommunityIcons name="arrow-right" size={20} color="#4CAF50" />
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.wordInput}
          value={inputWord}
          onChangeText={setInputWord}
          placeholder="Next word..."
          placeholderTextColor="#777"
          maxLength={targetWord.length}
          autoCapitalize="characters"
        />
        <Pressable 
          style={styles.submitButton}
          onPress={handleWordChainSubmit}
        >
          <Text style={styles.submitButtonText}>Go</Text>
        </Pressable>
      </View>
      
      <Text style={styles.attemptsText}>
        Attempts: {attempts}/{maxAttempts}
      </Text>
    </View>
  );

  const maxStepsText = (puzzleType === 'anagram' && startWord === 'RATS' && targetWord === 'STAR') ? '/2' : '';

  return (
    <View style={styles.container}>
      {puzzleType === 'anagram' && renderAnagramPuzzle()}
      {puzzleType === 'wordsearch' && renderWordSearchPuzzle()}
      {puzzleType === 'wordchain' && renderWordChainPuzzle()}
      
      <View style={styles.infoContainer}>
        {puzzleType !== 'wordchain' && <Text style={styles.stepsText}>Steps: {steps}{maxStepsText}</Text>}
        <Text style={styles.targetText}>Target: {targetWord}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  instruction: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  letterBox: {
    width: 54,
    height: 54,
    backgroundColor: '#333',
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
    fontSize: 28,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  stepsText: {
    color: '#aaa',
    fontSize: 14,
  },
  targetText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gridContainer: {
    marginVertical: 15,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 38,
    height: 38,
    backgroundColor: '#333',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  gridCellText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chainContainer: {
    width: '100%',
    alignItems: 'center',
  },
  chainWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 5,
  },
  chainWordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  chainWordText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  wordInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    width: 120,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#444',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  attemptsText: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
});