import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { toast } from 'sonner-native';

interface NumberSequencePuzzleProps {
  onComplete: () => void;
  config?: {
    sequence: (number | string)[];
    answer: number;
    options: number[];
    ruleHint?: string;
  };
}

export const NumberSequencePuzzle: React.FC<NumberSequencePuzzleProps> = ({ onComplete, config }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const sequence = config?.sequence || [2, 4, 8, 16, '?'];
  const answer = config?.answer ?? 32;
  const options = config?.options || [24, 28, 32, 36];
  const ruleHint = config?.ruleHint || '';

  const handleOptionPress = (option: number) => {
    if (answered) return;
    setSelected(option);
    if (option === answer) {
      setAnswered(true);
      toast.success('Correct! Great pattern recognition! 🎯');
      setTimeout(() => onComplete(), 800);
    } else {
      toast.error('Not quite! Look at the pattern again.');
      setTimeout(() => setSelected(null), 900);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What comes next?</Text>

      <View style={styles.sequenceRow}>
        {sequence.map((item, index) => (
          <View key={index} style={[styles.seqBox, typeof item === 'string' && styles.missingBox]}>
            <Text style={[styles.seqText, typeof item === 'string' && styles.missingText]}>{item}</Text>
          </View>
        ))}
      </View>

      {ruleHint ? <Text style={styles.ruleHint}>{ruleHint}</Text> : null}

      <Text style={styles.chooseLabel}>Choose your answer:</Text>

      <View style={styles.optionsGrid}>
        {options.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.optionBtn,
              selected === option && option === answer && styles.correctOpt,
              selected === option && option !== answer && styles.wrongOpt,
            ]}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', width: '100%' },
  label: { color: '#aaa', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  sequenceRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 20,
  },
  seqBox: {
    width: 54, height: 54, borderRadius: 10, backgroundColor: '#333',
    borderWidth: 2, borderColor: '#555', justifyContent: 'center', alignItems: 'center',
  },
  missingBox: { backgroundColor: '#0d2137', borderColor: '#2196F3', borderStyle: 'dashed' },
  seqText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  missingText: { color: '#2196F3', fontSize: 26 },
  ruleHint: { color: '#888', fontSize: 13, fontStyle: 'italic', marginBottom: 14, textAlign: 'center' },
  chooseLabel: { color: '#ccc', fontSize: 16, marginBottom: 16 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  optionBtn: {
    width: 80, height: 60, borderRadius: 12, backgroundColor: '#333',
    borderWidth: 2, borderColor: '#555', justifyContent: 'center', alignItems: 'center',
  },
  correctOpt: { backgroundColor: '#1B5E20', borderColor: '#4CAF50' },
  wrongOpt: { backgroundColor: '#4E0A0A', borderColor: '#F44336' },
  optionText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});
