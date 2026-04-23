import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FindObjectsPuzzleProps {
  onComplete: () => void;
  config?: {
    targetWord?: string;
    grid?: string[][];
  };
}

export const FindObjectsPuzzle: React.FC<FindObjectsPuzzleProps> = ({
  onComplete,
  config
}) => {
  const targetWord = config?.targetWord || 'BRAIN';
  const grid = config?.grid || [
    ['B', 'Q', 'W', 'E', 'R'],
    ['I', 'R', 'S', 'D', 'F'],
    ['D', 'Z', 'A', 'C', 'V'],
    ['D', 'B', 'N', 'I', 'L'],
    ['E', 'N', 'K', 'J', 'N']
  ];
  const [selectedCells, setSelectedCells] = useState<{ row: number, col: number }[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // Simple function to check if a cell is already selected
  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const getCellFromCoordinates = (x: number, y: number) => {
    const cellSize = 44; // cell width/height (40) + margin (4)
    const padding = 10; // gridContainer padding

    const adjustedX = x - padding;
    const adjustedY = y - padding;

    if (adjustedX < 0 || adjustedY < 0) return null;

    const col = Math.floor(adjustedX / cellSize);
    const row = Math.floor(adjustedY / cellSize);

    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
      return { row, col };
    }
    return null;
  };

  // Check if the current selection forms a valid word
  const checkSelection = () => {
    if (selectedCells.length < 2) {
      setSelectedCells([]);
      return;
    }

    const word = selectedCells.map(cell => grid[cell.row][cell.col]).join('');

    if (word === targetWord) {
      if (!foundWords.includes(word)) {
        setFoundWords([...foundWords, word]);
        setTimeout(() => {
          Alert.alert('Good job!', `You found "${word}"!`);
          onComplete();
        }, 500);
      }
    }

    setSelectedCells([]);
  };

  // Handle touch move to a new cell
  const handleTouchMove = (row: number, col: number) => {
    if (!isSelecting) return;

    const lastCell = selectedCells[selectedCells.length - 1];
    if (lastCell && lastCell.row === row && lastCell.col === col) return;

    if (selectedCells.length > 0) {
      const rowDiff = Math.abs(lastCell.row - row);
      const colDiff = Math.abs(lastCell.col - col);

      if (rowDiff > 1 || colDiff > 1) return;

      if (selectedCells.length > 1) {
        const firstCell = selectedCells[0];
        const secondCell = selectedCells[1];
        const dy = secondCell.row - firstCell.row;
        const dx = secondCell.col - firstCell.col;

        if (row !== lastCell.row + dy || col !== lastCell.col + dx) {
          const prevCell = selectedCells[selectedCells.length - 2];
          if (prevCell && row === prevCell.row && col === prevCell.col) {
            setSelectedCells(selectedCells.slice(0, -1));
          }
          return;
        }
      }
    }

    if (isCellSelected(row, col)) return;

    setSelectedCells([...selectedCells, { row, col }]);
  };

  // Show hint
  const showHint = () => {
    Alert.alert('Hint', `Look for "${targetWord}" in the grid. It can be found horizontally, vertically, or diagonally.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find the hidden word in the grid of letters</Text>

      <Text style={styles.subtitle}>
        Find the hidden word: <Text style={styles.targetWord}>{targetWord}</Text>
      </Text>
      <Text style={styles.instructions}>Drag to connect letters and form the word</Text>

      <View
        style={styles.gridContainer}
        onStartShouldSetResponder={() => true}
        onResponderGrant={(evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          setIsSelecting(true);
          const cell = getCellFromCoordinates(locationX, locationY);
          if (cell) {
            setSelectedCells([{ row: cell.row, col: cell.col }]);
          } else {
            setSelectedCells([]);
          }
        }}
        onResponderMove={(evt) => {
          if (!isSelecting) return;
          const { locationX, locationY } = evt.nativeEvent;
          const cell = getCellFromCoordinates(locationX, locationY);
          if (cell) {
            handleTouchMove(cell.row, cell.col);
          }
        }}
        onResponderRelease={() => {
          if (isSelecting) {
            checkSelection();
            setIsSelecting(false);
          }
        }}
      >
        {grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((letter, colIndex) => (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  isCellSelected(rowIndex, colIndex) && styles.selectedCell,
                  foundWords.includes(targetWord) &&
                  selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) &&
                  styles.foundCell
                ]}
              >
                <Text style={styles.cellText}>{letter}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.foundCounter}>
          Words found: {foundWords.length}
        </Text>
        <Pressable style={styles.hintButton} onPress={showHint}>
          <Text style={styles.hintButtonText}>Hint</Text>
        </Pressable>
      </View>

      <Text style={styles.note}>
        The word can be horizontal, vertical, diagonal, or reversed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
    textAlign: 'center',
  },
  targetWord: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  gridContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    backgroundColor: '#444',
    borderRadius: 4,
  },
  selectedCell: {
    backgroundColor: '#2196F3',
  },
  foundCell: {
    backgroundColor: '#4CAF50',
  },
  cellText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  foundCounter: {
    fontSize: 16,
    color: '#ccc',
  },
  hintButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  hintButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});