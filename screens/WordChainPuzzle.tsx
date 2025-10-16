import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WordChainPuzzleProps {
  startWord: string;
  targetWord: string;
  maxAttempts: number;
  onComplete: () => void;
}

export default function WordChainPuzzle({ 
  startWord = 'COLD', 
  targetWord = 'WARM', 
  maxAttempts = 4,
  onComplete 
}: WordChainPuzzleProps) {
  const [currentWord, setCurrentWord] = useState(startWord);
  const [wordChain, setWordChain] = useState([startWord]);
  const [inputLetter, setInputLetter] = useState('');
  const [position, setPosition] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');

  // Dictionary of valid English words for this specific puzzle
  const validWords = new Set(['COLD', 'CORD', 'WORD', 'WORM', 'WARM']);

  // Reset when props change
  useEffect(() => {
    setCurrentWord(startWord);
    setWordChain([startWord]);
    setInputLetter('');
    setPosition(0);
    setAttempts(0);
    setIsComplete(false);
    setError('');
  }, [startWord, targetWord]);

  const handleLetterChange = (letter: string) => {
    // Only allow single letters
    if (letter.length > 1) {
      letter = letter.charAt(letter.length - 1);
    }
    
    // Convert to uppercase
    letter = letter.toUpperCase();
    
    // Only allow alphabets
    if (letter && !/^[A-Z]$/.test(letter)) {
      return;
    }
    
    setInputLetter(letter);
  };

  const handlePositionSelect = (index: number) => {
    setPosition(index);
    setError('');
  };

  const handleSubmit = () => {
    if (!inputLetter) {
      setError('Please enter a letter');
      return;
    }

    // Create the new word by replacing the letter at the selected position
    const newWordArray = currentWord.split('');
    newWordArray[position] = inputLetter;
    const newWord = newWordArray.join('');

    // Check if the letter actually changed
    if (newWord === currentWord) {
      setError('You need to change the letter');
      return;
    }

    // Check if the new word is valid
    if (!validWords.has(newWord)) {
      setError(`"${newWord}" is not a valid word in this puzzle`);
      setAttempts(attempts + 1);
      return;
    }

    // Update the current word and chain
    setCurrentWord(newWord);
    setWordChain([...wordChain, newWord]);
    setInputLetter('');
    setAttempts(attempts + 1);
    setError('');

    // Check if the puzzle is complete
    if (newWord === targetWord) {
      setIsComplete(true);
      setTimeout(() => {
        Alert.alert('Congratulations!', 'You have successfully transformed the word!');
        onComplete();
      }, 500);
    }

    // Check if max attempts reached
    if (attempts + 1 >= maxAttempts && newWord !== targetWord) {
      setTimeout(() => {
        Alert.alert('Game Over', 'You have used all your attempts. Try again!');
      }, 500);
    }
  };

  const showHint = () => {
    Alert.alert(
      'Hint',
      'Try this sequence: COLD → CORD → WORD → WORM → WARM'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Word Chain Puzzle</Text>
      <Text style={styles.instructions}>
        Transform "{startWord}" into "{targetWord}" by changing one letter at a time.
        Each intermediate word must be a valid English word.
      </Text>

      <View style={styles.wordChainContainer}>
        {wordChain.map((word, index) => (
          <View key={index} style={styles.chainItem}>
            <Text style={styles.chainWord}>{word}</Text>
            {index < wordChain.length - 1 && (
              <Text style={styles.arrow}>→</Text>
            )}
          </View>
        ))}
      </View>

      <Text style={styles.subtitle}>Current Word: {currentWord}</Text>

      <View style={styles.letterContainer}>
        {currentWord.split('').map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.letterBox,
              position === index && styles.selectedLetterBox
            ]}
            onPress={() => handlePositionSelect(index)}
          >
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Replace with:</Text>
        <TextInput
          style={styles.input}
          value={inputLetter}
          onChangeText={handleLetterChange}
          maxLength={1}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="?"
        />
        <TouchableOpacity
          style={[styles.submitButton, !inputLetter && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!inputLetter || isComplete}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.infoContainer}>
        <Text style={styles.info}>
          Attempts: {attempts}/{maxAttempts}
        </Text>
        {attempts >= 2 && !isComplete && (
          <TouchableOpacity style={styles.hintButton} onPress={showHint}>
            <Text style={styles.hintButtonText}>Hint</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.validWordsContainer}>
        <Text style={styles.validWordsTitle}>Valid words for this puzzle:</Text>
        <Text style={styles.validWordsText}>COLD, CORD, WORD, WORM, WARM</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#ccc',
  },
  wordChainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  chainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  chainWord: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  arrow: {
    fontSize: 18,
    marginHorizontal: 4,
    color: '#4CAF50',
  },
  letterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  letterBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  selectedLetterBox: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#1e3a1e',
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    color: '#fff',
  },
  input: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#444',
    fontSize: 28,
    textAlign: 'center',
    backgroundColor: '#333',
    marginRight: 16,
    color: '#fff',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  info: {
    fontSize: 16,
    color: '#ccc',
  },
  hintButton: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  hintButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  validWordsContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  validWordsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ccc',
    marginBottom: 4,
  },
  validWordsText: {
    fontSize: 14,
    color: '#999',
  },
});