import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, PanResponder, Dimensions } from 'react-native';
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

  const screenWidth = Dimensions.get('window').width;
  const numCols = grid[0].length;
  const containerPadding = 24; // Total horizontal padding
  const gridPadding = 16;
  const totalAvailableWidth = screenWidth - containerPadding - gridPadding;
  const cellSize = Math.floor(Math.min(44, (totalAvailableWidth / numCols) - 6));
  const fullCellSize = cellSize + 6; // size + margin

  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [found, setFound] = useState(false);
  const [gridLayout, setGridLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [currentTouch, setCurrentTouch] = useState<{ x: number; y: number } | null>(null);

  const gridRef = React.useRef<View>(null);

  const isCellSelected = (row: number, col: number) =>
    selectedCells.some(c => c.row === row && c.col === col);

  const handleCellPress = (row: number, col: number) => {
    if (found) return;

    // Check if cell is valid next step in current direction
    const newCells = [...selectedCells];
    const alreadyIdx = newCells.findIndex(c => c.row === row && c.col === col);
    
    if (alreadyIdx !== -1) {
        if (alreadyIdx === newCells.length - 1) {
            setSelectedCells(newCells.slice(0, -1));
        }
        return;
    }

    if (newCells.length >= 2) {
      const dr = newCells[1].row - newCells[0].row;
      const dc = newCells[1].col - newCells[0].col;
      const last = newCells[newCells.length - 1];
      if (row - last.row !== dr || col - last.col !== dc) {
        return;
      }
    } else if (newCells.length === 1) {
        const last = newCells[0];
        if (Math.abs(row - last.row) > 1 || Math.abs(col - last.col) > 1) {
            return;
        }
    }

    const updated = [...newCells, { row, col }];
    setSelectedCells(updated);
    checkWord(updated);
  };

  const checkWord = (cells: { row: number; col: number }[]) => {
    if (cells.length === targetWord.length) {
      const formed = cells.map(c => grid[c.row][c.col]).join('');
      if (formed === targetWord || formed === targetWord.split('').reverse().join('')) {
        setFound(true);
        toast.success(`You found "${targetWord}"! 🎉`);
        setTimeout(() => onComplete(), 800);
      } else {
        setTimeout(() => setSelectedCells([]), 900);
      }
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (!found) {
            setSelectedCells([]);
            setCurrentTouch(null);
        }
        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (found) return;
        
        const { moveX, moveY } = gestureState;
        const relX = moveX - gridLayout.x;
        const relY = moveY - gridLayout.y;
        
        setCurrentTouch({ x: relX, y: relY });
        handleDrag(relX, relY);
      },
      onPanResponderRelease: () => {
        setCurrentTouch(null);
      }
    })
  ).current;

  const handleDrag = (relX: number, relY: number) => {
    if (found) return;

    const col = Math.floor((relX - 8) / fullCellSize);
    const row = Math.floor((relY - 8) / fullCellSize);

    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
        // Use functional state to avoid closure issues
        setSelectedCells(prev => {
            const last = prev[prev.length - 1];
            if (last && last.row === row && last.col === col) return prev;
            
            // Check if already selected elsewhere (avoid loops)
            if (prev.some(c => c.row === row && c.col === col)) return prev;

            // Direction logic
            if (prev.length >= 2) {
                const dr = prev[1].row - prev[0].row;
                const dc = prev[1].col - prev[0].col;
                if (row - last.row !== dr || col - last.col !== dc) return prev;
            } else if (prev.length === 1) {
                if (Math.abs(row - last.row) > 1 || Math.abs(col - last.col) > 1) return prev;
            }

            const updated = [...prev, { row, col }];
            return updated;
        });
    }
  };

  React.useEffect(() => {
    checkWord(selectedCells);
  }, [selectedCells]);

  // Initial measure for web/immediate use
  const onGridLayout = (evt: any) => {
    const { x, y, width, height } = evt.nativeEvent.layout;
    // Note: layout is relative to parent. For PanResponder we need screen coordinates.
    // measureInWindow is better for that.
    gridRef.current?.measureInWindow((nx, ny, nw, nh) => {
        if (nx !== undefined) {
            setGridLayout({ x: nx, y: ny, width: nw, height: nh });
        } else {
            // Fallback for web/some environments
            setGridLayout({ x, y, width, height });
        }
    });
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

      <View 
        ref={gridRef}
        collapsable={false}
        style={styles.gridContainer}
        {...panResponder.panHandlers}
        onLayout={onGridLayout}
      >
        {/* Visual Line */}
        {selectedCells.length > 0 && currentTouch && (
            <View 
                style={[
                    styles.selectionLine,
                    {
                        left: (selectedCells[0].col * fullCellSize) + cellSize/2 + 8,
                        top: (selectedCells[0].row * fullCellSize) + cellSize/2 + 8,
                        width: Math.sqrt(Math.pow(currentTouch.x - ((selectedCells[0].col * fullCellSize) + cellSize/2 + 8), 2) + Math.pow(currentTouch.y - ((selectedCells[0].row * fullCellSize) + cellSize/2 + 8), 2)),
                        transform: [
                            { rotate: `${Math.atan2(currentTouch.y - ((selectedCells[0].row * fullCellSize) + cellSize/2 + 8), currentTouch.x - ((selectedCells[0].col * fullCellSize) + cellSize/2 + 8))}rad` }
                        ],
                        height: 20,
                        marginTop: -10,
                    }
                ]}
                pointerEvents="none"
            />
        )}

        {grid.map((rowArr, rowIdx) => (
          <View key={rowIdx} style={styles.row} pointerEvents="none">
            {rowArr.map((letter, colIdx) => (
              <View
                key={colIdx}
                style={[
                    styles.cell, 
                    getCellStyle(rowIdx, colIdx),
                    { width: cellSize, height: cellSize }
                ]}
              >
                <Text style={[styles.cellText, { fontSize: cellSize * 0.4 }]}>{letter}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, alignItems: 'center' },
  subtitle: { fontSize: 17, color: '#ccc', marginBottom: 6, textAlign: 'center' },
  targetWord: { color: '#4CAF50', fontWeight: 'bold', fontSize: 20 },
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
  selectionLine: {
    position: 'absolute',
    backgroundColor: 'rgba(33, 150, 243, 0.4)',
    borderRadius: 10,
    zIndex: -1,
  }
});