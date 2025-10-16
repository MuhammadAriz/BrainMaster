import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FindObjectsPuzzleProps {
  targetWord: string;
  grid: string[][];
  onComplete: () => void;
}

export default function FindObjectsPuzzle({ 
  targetWord = 'HIDDEN', 
  grid = [
    ['H', 'Q', 'W', 'E', 'R'],
    ['I', 'A', 'S', 'D', 'F'],
    ['D', 'Z', 'X', 'C', 'V'],
    ['D', 'B', 'N', 'M', 'L'],
    ['E', 'N', 'K', 'J', 'H']
  ],
  onComplete 
}: FindObjectsPuzzleProps) {
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  
  // Simple function to check if a cell is already selected
  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Check if the current selection forms a valid word
  const checkSelection = () => {
    if (selectedCells.length < 2) return;
    
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

  // Handle touch start on a cell
  const handleTouchStart = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{row, col}]);
  };

  // Handle touch move to a new cell
  const handleTouchMove = (row: number, col: number) => {
    if (!isSelecting) return;
    
    // If this cell is already the last selected cell, do nothing
    const lastCell = selectedCells[selectedCells.length - 1];
    if (lastCell && lastCell.row === row && lastCell.col === col) return;
    
    // Check if this is a valid move (adjacent to last cell)
    if (selectedCells.length > 0) {
      const rowDiff = Math.abs(lastCell.row - row);
      const colDiff = Math.abs(lastCell.col - col);
      
      // Only allow moves to adjacent cells (including diagonals)
      if (rowDiff > 1 || colDiff > 1) return;
      
      // Ensure we're moving in a straight line
      if (selectedCells.length > 1) {
        const prevCell = selectedCells[selectedCells.length - 2];
        const prevRowDiff = lastCell.row - prevCell.row;
        const prevColDiff = lastCell.col - prevCell.col;
        const currRowDiff = row - lastCell.row;
        const currColDiff = col - lastCell.col;
        
        // Check if we're continuing in the same direction
        if (prevRowDiff !== 0 && currRowDiff !== 0 && Math.sign(prevRowDiff) !== Math.sign(currRowDiff)) return;
        if (prevColDiff !== 0 && currColDiff !== 0 && Math.sign(prevColDiff) !== Math.sign(currColDiff)) return;
        
        // Check if we're maintaining the same slope
        if (prevRowDiff !== 0 && prevColDiff !== 0) {
          const prevSlope = prevColDiff / prevRowDiff;
          const currSlope = currColDiff / currRowDiff;
          if (Math.abs(prevSlope - currSlope) > 0.1) return; // Allow small floating point errors
        }
      }
    }
    
    // If the cell is already selected, do nothing
    if (isCellSelected(row, col)) return;
    
    setSelectedCells([...selectedCells, {row, col}]);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (isSelecting) {
      checkSelection();
      setIsSelecting(false);
    }
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
      
      <View style={styles.gridContainer}>
        {grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((letter, colIndex) => (
              <Pressable
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  isCellSelected(rowIndex, colIndex) && styles.selectedCell,
                  foundWords.includes(targetWord) && 
                  selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) && 
                  styles.foundCell
                ]}
                onPressIn={() => handleTouchStart(rowIndex, colIndex)}
                onTouchMove={(e) => {
                  const { locationX, locationY } = e.nativeEvent;
                  const cellSize = 40; // Approximate cell size
                  const newRow = Math.floor(locationY / cellSize);
                  const newCol = Math.floor(locationX / cellSize);
                  if (newRow >= 0 && newRow < grid.length && 
                      newCol >= 0 && newCol < grid[0].length) {
                    handleTouchMove(newRow, newCol);
                  }
                }}
                onTouchEnd={handleTouchEnd}
              >
                <Text style={styles.cellText}>{letter}</Text>
              </Pressable>
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