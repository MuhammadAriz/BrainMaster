import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LightBulbPuzzle } from '../components/puzzles/LightBulbPuzzle';
import { CountingPuzzle } from '../components/puzzles/CountingPuzzle';
import { WordPuzzle } from '../components/puzzles/WordPuzzle';
import { MathPuzzle } from '../components/puzzles/MathPuzzle';
import { PatternPuzzle } from '../components/puzzles/PatternPuzzle';
import { LogicPuzzle } from '../components/puzzles/LogicPuzzle';
import { ColorPuzzle } from '../components/puzzles/ColorPuzzle';
import { FindObjectsPuzzle } from '../components/puzzles/FindObjectsPuzzle';

export interface Level {
  id: number;
  title: string;
  category: 'MATH' | 'PHYSICS' | 'LOGIC' | 'KNOWLEDGE' | 'SORTING' | 'STRATEGY';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  hint: string;
  component: React.ComponentType<any>;
  config?: any;
}

// Define levels without any external API calls or heavy computations
const levels: Record<number, Level> = {
  // Math & Logic Puzzles (1-5)
  1: {
    id: 1,
    title: "Odd One Out",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Find the object that doesn't belong in the grid.",
    hint: "Look for the item that differs in shape, color, or pattern from the others.",
    component: LogicPuzzle,
    config: {
      numbers: [3, 5, 7, 9],
      answer: 4
    }
  },

  2: {
    id: 2,
    title: "Light the Bulb",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Turn on the light bulb. The switch might not work as expected...",
    hint: "Sometimes you need to warm up the bulb first. Try tapping it multiple times!",
    component: LightBulbPuzzle
  },

  3: {
    id: 3,
    title: "Count the Triangles",
    category: 'MATH',
    difficulty: 'easy',
    question: "How many triangles can you find in this figure?",
    hint: "Don't forget to count the triangles formed by smaller triangles!",
    component: CountingPuzzle
  },

  4: {
    id: 4,
    title: "Word Transform",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Transform 'RATS' into 'STAR'",
    hint: "You can rotate letters to make new ones. Try rotating 'S'!",
    component: WordPuzzle
  },

  5: {
    id: 5,
    title: "Simple Math",
    category: 'MATH',
    difficulty: 'easy',
    question: "Create an equation that equals 10 using the numbers provided",
    hint: "Try combining addition and multiplication",
    component: MathPuzzle,
    config: {
      numbers: [2, 3, 4, 5],
      target: 10,
      multipleOperators: true
    }
  },

  // Pattern Recognition (6-10)
  6: {
    id: 6,
    title: "Color Sequence",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Repeat the color pattern shown",
    hint: "Pay attention to the order of colors!",
    component: ColorPuzzle,
    config: {
      sequence: ['red', 'blue', 'yellow'],
      showInitialPattern: true
    }
  },

  7: {
    id: 7,
    title: "Pattern Match",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Complete the pattern by selecting dots in the correct order",
    hint: "The pattern follows a clockwise direction",
    component: PatternPuzzle,
    config: {
      pattern: [0, 1, 2, 3],
      clockwise: true
    }
  },

  8: {
    id: 8,
    title: "Math Magic",
    category: 'MATH',
    difficulty: 'easy',
    question: "Make 15 using three numbers",
    hint: "Try using both addition and multiplication",
    component: MathPuzzle,
    config: {
      numbers: [3, 5, 7, 1],
      target: 15,
      multipleOperators: true
    }
  },

  9: {
    id: 9,
    title: "Word Puzzle",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Make 'STOP' from 'POST'",
    hint: "Think about how letters can be rearranged",
    component: WordPuzzle,
    config: {
      word: 'POST',
      target: 'STOP'
    }
  },

  10: {
    id: 10,
    title: "Light Pattern",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "Create a specific pattern of lights",
    hint: "The middle light needs to be activated last",
    component: LightBulbPuzzle,
    config: {
      pattern: true,
      smallerSize: true
    }
  },
   // Level 11 - Odd One Out
  11: {
  id: 11,
  title: "Shape Shifter",
  category: 'LOGIC',
  difficulty: 'easy',
  question: "Which shape has been rotated and mirrored?",
  hint: "Look at the orientation of each shape closely. One of them looks flipped!",
  component: LogicPuzzle,
  config: {
    shapes: ['⬛', '⬛', '🔺', '🔺'],
    answer: 3
  }
},
  // Level 12 - Light Bulb Puzzle
  12: {
    id: 12,
    title: "Let There Be Light",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Turn on all the bulbs. Tapping one toggles its state and adjacent bulbs.",
    hint: "Try to understand how each tap affects the pattern. Sometimes you need to turn some bulbs off temporarily to get the final solution.",
    component: LightBulbPuzzle
  },
   // Level 13 - Counting Puzzle
13: {
  id: 13,
  title: "Square Squad",
  category: 'MATH',
  difficulty: 'easy',
  question: "How many squares can you find in this figure?",
  hint: "Count both small and larger squares formed by combining smaller ones.",
  component: CountingPuzzle,
  config: {
    answer: 14
  }
},

  // Level 14 - Word Puzzle
14: {
  id: 14,
  title: "Word Chain",
  category: 'LOGIC',
  difficulty: 'easy',
  question: "Start with 'COLD' and end at 'WARM', changing one letter at a time.",
  hint: "Each step must form a valid English word. Try: COLD → CORD → WORD → WORM → WARM",
  component: WordPuzzle,
  config: {
    word: 'COLD',
    target: 'WARM',
    type: 'wordchain',
    chain: ['COLD', 'CORD', 'WORD', 'WORM', 'WARM']
  }
},

  // Level 15 - Math Puzzle
  15: {
    id: 15,
    title: "Make it 10",
    category: 'MATH',
    difficulty: 'easy',
    question: "Create an equation that equals 10 using the numbers provided",
    hint: "Try combining addition and multiplication to reach the target number.",
    component: MathPuzzle,
    config: {
      numbers: [1, 3, 4, 6],
      target: 10,
      multipleOperators: true
    }
  },

  // Level 16 - Pattern Puzzle
  16: {
    id: 16,
    title: "Next in Line",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Find the next shape in the sequence",
    hint: "Look for alternating patterns, increasing sizes, or rotations in the sequence.",
    component: PatternPuzzle,
    config: {
      pattern: [0, 1, 2, 3],
      clockwise: true
    }
  },

  // Level 17 - Color Sequence Puzzle
  17: {
    id: 17,
    title: "Color Coded",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Repeat the sequence of blinking colors in the correct order",
    hint: "Pay attention to the order of colors! The sequence will get longer as you progress.",
    component: ColorPuzzle,
    config: {
      sequence: ['red', 'blue', 'yellow'],
      showInitialPattern: true
    }
  },

  // Level 18 - Toggle Path
  18: {
    id: 18,
    title: "Light the Way",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "Light up all floor tiles by stepping on each tile exactly once",
    hint: "Plan your path carefully. You can't step on the same tile twice, and you must cover all tiles.",
    component: PatternPuzzle,
    config: {
      gridSize: 3,
      pathType: 'toggle'
    }
  },

  // Level 19 - Hidden Word Finder
  19: {
    id: 19,
    title: "Hidden in Sight",
    category: 'KNOWLEDGE',
    difficulty: 'medium',
    question: "Find the hidden word in the grid of letters",
    hint: "The word can be hidden horizontally, vertically, or diagonally. Look carefully!",
    component: FindObjectsPuzzle,
    config: {
      targetWord: 'HIDDEN',
      grid: [
        ['H', 'Q', 'W', 'E', 'R'],
        ['I', 'A', 'S', 'D', 'F'],
        ['D', 'Z', 'X', 'C', 'V'],
        ['D', 'B', 'N', 'M', 'L'],
        ['E', 'N', 'K', 'J', 'H']
      ]
    }
  },

  // Level 20 - Emoji Equations
  20: {
    id: 20,
    title: "Emoji Equations",
    category: 'MATH',
    difficulty: 'medium',
    question: "Solve the value of each emoji in the equations",
    hint: "Use the given equations to deduce the value of each emoji. Think of it like algebra!",
    component: MathPuzzle,
    config: {
      type: 'emoji',
      equations: [
        { emoji: ['🍎', '🍎', '🍌'], result: 10 },
        { emoji: ['🍎', '🍌'], result: 7 }
      ],
      solution: { '🍎': 4, '🍌': 3 }
    }
  }
};

// Helper function to get level data
export const getLevelData = (levelId: number): Level | null => {
  return levels[levelId] || null;
};