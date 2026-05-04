import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { toast } from 'sonner-native';

interface FindObjectsPuzzleProps {
  onComplete: () => void;
  config?: {
    targetWord?: string;
    grid?: string[][];
  };
}

export const FindObjectsPuzzle: React.FC<FindObjectsPuzzleProps> = ({ onComplete, config }) => {
  const targetWord = config?.targetWord || 'BRAIN';

  // Default grid — BRAIN hidden diagonally top-left to bottom-right
  const grid = config?.grid || [
    ['B', 'K', 'P', 'M', 'Z'],
    ['T', 'R', 'W', 'Q', 'X'],
    ['V', 'S', 'A', 'J', 'C'],
    ['N', 'L', 'U', 'I', 'F'],
    ['G', 'H', 'E', 'O', 'N'],
  ];

  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [found, setFound] = useState(false);

  const isCellSelected = (row: number, col: number) =>
    selectedCells.some(c => c.row === row && c.col === col);

  const handleCellPress = (row: number, col: number) => {
    if (found) return;

    // If already selected, deselect it (and everything after) unless it's the last
    const existingIdx = selectedCells.findIndex(c => c.row === row && c.col === col);
    if (existingIdx !== -1) {
      // Tap on last selected cell = clear
      if (existingIdx === selectedCells.length - 1) {
        setSelectedCells(selectedCells.slice(0, -1));
      }
      return;
    }

    const newCells = [...selectedCells, { row, col }];

    // Validate direction: all cells must be in the same direction
    if (newCells.length >= 2) {
      const dr = newCells[1].row - newCells[0].row;
      const dc = newCells[1].col - newCells[0].col;
      const last = newCells[newCells.length - 2];
      const curr = newCells[newCells.length - 1];
      if (curr.row - last.row !== dr || curr.col - last.col !== dc) {
        toast.error('Keep tapping in the same direction!');
        return;
      }
    }

    setSelectedCells(newCells);

    // Check if formed the word
    if (newCells.length === targetWord.length) {
      const formed = newCells.map(c => grid[c.row][c.col]).join('');
      if (formed === targetWord || formed === targetWord.split('').reverse().join('')) {
        setFound(true);
        toast.success(`You found "${targetWord}"! 🎉`);
        setTimeout(() => onComplete(), 800);
      } else {
        toast.error('Not the word. Try again!');
        setTimeout(() => setSelectedCells([]), 900);
      }
    }
  };

  const getCellStyle = (row: number, col: number) => {
    if (found && isCellSelected(row, col)) return styles.foundCell;
    if (isCellSelected(row, col)) return styles.selectedCell;
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Find: <Text style={styles.targetWord}>{targetWord}</Text>
      </Text>
      <Text style={styles.instructions}>
        Tap {targetWord.length} letters in a row (horizontal, vertical or diagonal)
      </Text>

      <View style={styles.gridContainer}>
        {grid.map((rowArr, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {rowArr.map((letter, colIdx) => (
              <Pressable
                key={colIdx}
                style={[styles.cell, getCellStyle(rowIdx, colIdx)]}
                onPress={() => handleCellPress(rowIdx, colIdx)}
              >
                <Text style={styles.cellText}>{letter}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <Pressable style={styles.clearBtn} onPress={() => setSelectedCells([])}>
        <Text style={styles.clearText}>Clear Selection</Text>
      </Pressable>

      <Text style={styles.progress}>
        Selected: {selectedCells.length} / {targetWord.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, alignItems: 'center' },
  subtitle: { fontSize: 17, color: '#ccc', marginBottom: 6, textAlign: 'center' },
  targetWord: { color: '#4CAF50', fontWeight: 'bold', fontSize: 20 },
  instructions: { fontSize: 13, color: '#888', marginBottom: 18, textAlign: 'center', lineHeight: 18 },
  gridContainer: { backgroundColor: '#2a2a2a', borderRadius: 10, padding: 8 },
  row: { flexDirection: 'row' },
  cell: {
    width: 44, height: 44, margin: 3, borderRadius: 6,
    backgroundColor: '#444', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#555',
  },
  selectedCell: { backgroundColor: '#1565C0', borderColor: '#2196F3', borderWidth: 2 },
  foundCell: { backgroundColor: '#2E7D32', borderColor: '#4CAF50', borderWidth: 2 },
  cellText: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  clearBtn: {
    marginTop: 16, backgroundColor: '#444', paddingHorizontal: 20,
    paddingVertical: 8, borderRadius: 16,
  },
  clearText: { color: '#fff', fontSize: 14 },
  progress: { marginTop: 10, color: '#888', fontSize: 13 },
});