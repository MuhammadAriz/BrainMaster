import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { toast } from 'sonner-native';

interface AnagramPuzzleProps {
  onComplete: () => void;
  config?: {
    scrambled: string;
    answer: string;
    category?: string;
  };
}

export const AnagramPuzzle: React.FC<AnagramPuzzleProps> = ({ onComplete, config }) => {
  const answer = config?.answer || 'BRAIN';
  const scrambled = config?.scrambled || 'NAIRB';
  const category = config?.category || '';

  const scrambledLetters = scrambled.split('');
  const [built, setBuilt] = useState<{ letter: string; srcIdx: number }[]>([]);
  const [usedIdx, setUsedIdx] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  const addLetter = (letter: string, idx: number) => {
    if (solved || usedIdx.includes(idx)) return;
    const newBuilt = [...built, { letter, srcIdx: idx }];
    const newUsed = [...usedIdx, idx];
    setBuilt(newBuilt);
    setUsedIdx(newUsed);

    if (newBuilt.length === answer.length) {
      const formed = newBuilt.map(b => b.letter).join('');
      if (formed === answer) {
        setSolved(true);
        toast.success(`"${answer}" — Brilliant! 🎉`);
        setTimeout(() => onComplete(), 800);
      } else {
        toast.error('Not right! Try a different order.');
        setTimeout(() => { setBuilt([]); setUsedIdx([]); }, 900);
      }
    }
  };

  const removeLetter = (i: number) => {
    if (solved) return;
    const removed = built[i];
    setBuilt(built.filter((_, j) => j !== i));
    setUsedIdx(usedIdx.filter(x => x !== removed.srcIdx));
  };

  return (
    <View style={styles.container}>
      {category ? <Text style={styles.category}>Category: {category}</Text> : null}

      {/* Build area */}
      <View style={styles.buildRow}>
        {Array.from({ length: answer.length }).map((_, i) => (
          <Pressable key={i} style={[styles.slot, built[i] && styles.filledSlot]} onPress={() => built[i] && removeLetter(i)}>
            <Text style={styles.slotText}>{built[i]?.letter || ''}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.hint}>
        {built.length > 0 ? 'Tap a placed letter to remove it' : 'Tap letters to spell the word'}
      </Text>

      {/* Letter bank */}
      <View style={styles.letterBank}>
        {scrambledLetters.map((letter, idx) => (
          <Pressable
            key={idx}
            style={[styles.tile, usedIdx.includes(idx) && styles.usedTile]}
            onPress={() => addLetter(letter, idx)}
            disabled={usedIdx.includes(idx)}
          >
            <Text style={[styles.tileText, usedIdx.includes(idx) && styles.usedText]}>{letter}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.clearBtn} onPress={() => { setBuilt([]); setUsedIdx([]); }}>
        <Text style={styles.clearText}>Clear All</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', width: '100%' },
  category: { color: '#FFD700', fontSize: 14, marginBottom: 14, fontStyle: 'italic' },
  buildRow: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap', justifyContent: 'center' },
  slot: {
    width: 48, height: 56, borderRadius: 8, backgroundColor: '#1a1a2e',
    borderWidth: 2, borderColor: '#444', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center',
  },
  filledSlot: { backgroundColor: '#1565C0', borderColor: '#2196F3', borderStyle: 'solid' },
  slotText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  hint: { color: '#666', fontSize: 12, marginBottom: 24, textAlign: 'center' },
  letterBank: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 },
  tile: {
    width: 54, height: 62, borderRadius: 8, backgroundColor: '#333',
    borderWidth: 2, borderColor: '#FFD700', justifyContent: 'center', alignItems: 'center',
  },
  usedTile: { backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', opacity: 0.4 },
  tileText: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' },
  usedText: { color: '#444' },
  clearBtn: { backgroundColor: '#444', paddingHorizontal: 28, paddingVertical: 10, borderRadius: 20 },
  clearText: { color: '#fff', fontSize: 15 },
});
