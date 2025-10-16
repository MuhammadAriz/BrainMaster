import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface GenericPuzzleProps {
  type: string;
  config: any;
  onComplete: () => void;
}

export const GenericPuzzle: React.FC<GenericPuzzleProps> = ({ type, config, onComplete }) => {
  const [state, setState] = useState({
    attempts: 0,
    selected: null,
    progress: 0
  });

  const handleAnswer = (answer: any) => {
    if (isCorrectAnswer(answer)) {
      toast.success('Correct!');
      onComplete();
    } else {
      toast.error('Try again!');
      setState(prev => ({ ...prev, attempts: prev.attempts + 1 }));
    }
  };

  const isCorrectAnswer = (answer: any) => {
    // Logic to check answer based on puzzle type
    return config.answer === answer;
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      {/* Render puzzle based on type */}
      {renderPuzzle(type, config, handleAnswer)}
    </Animated.View>
  );
};

const renderPuzzle = (type: string, config: any, onAnswer: (answer: any) => void) => {
  switch (type) {
    case 'sequence':
      return <SequencePuzzle config={config} onAnswer={onAnswer} />;
    case 'gravity':
      return <GravityPuzzle config={config} onAnswer={onAnswer} />;
    case 'matching':
      return <MatchingPuzzle config={config} onAnswer={onAnswer} />;
    // Add more puzzle type renderers
    default:
      return <Text style={styles.error}>Unknown puzzle type</Text>;
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#ff4444',
    fontSize: 16,
  }
});