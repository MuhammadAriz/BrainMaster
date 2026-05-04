import { LightBulbPuzzle } from '../components/puzzles/LightBulbPuzzle';
import { CountingPuzzle } from '../components/puzzles/CountingPuzzle';
import { WordPuzzle } from '../components/puzzles/WordPuzzle';
import { MathPuzzle } from '../components/puzzles/MathPuzzle';
import { PatternPuzzle } from '../components/puzzles/PatternPuzzle';
import { LogicPuzzle } from '../components/puzzles/LogicPuzzle';
import { ColorPuzzle } from '../components/puzzles/ColorPuzzle';
import { FindObjectsPuzzle } from '../components/puzzles/FindObjectsPuzzle';
import { NumberSequencePuzzle } from '../components/puzzles/NumberSequencePuzzle';
import { AnagramPuzzle } from '../components/puzzles/AnagramPuzzle';
import { SensorPuzzle } from '../components/puzzles/SensorPuzzle';

export interface Level {
  id: number;
  title: string;
  category: 'MATH' | 'PHYSICS' | 'LOGIC' | 'KNOWLEDGE' | 'MEMORY' | 'PATTERN' | 'OBSERVATION';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  hint: string;
  hints?: string[];
  component: React.ComponentType<any>;
  config?: any;
}

const levels: Record<number, Level> = {
  // --- EASY (1-10) ---
  1: {
    id: 1,
    title: "Odd One Out",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Find the object that doesn't belong in the grid.",
    hint: "Look for the item that differs in shape, color, or pattern from the others.",
    component: LogicPuzzle,
    config: { numbers: [3, 5, 7, 9], answer: 4 }
  },
  2: {
    id: 2,
    title: "Simple Math",
    category: 'MATH',
    difficulty: 'easy',
    question: "Create an equation that equals 10 using the numbers provided.",
    hint: "Try combining addition and multiplication.",
    component: MathPuzzle,
    config: { numbers: [2, 3, 4, 5], target: 10, multipleOperators: true }
  },
  3: {
    id: 3,
    title: "Word Transform",
    category: 'KNOWLEDGE',
    difficulty: 'easy',
    question: "Transform 'RATS' into 'STAR'",
    hint: "You can rotate letters to make new ones. Try rotating 'S'!",
    component: WordPuzzle,
    config: { word: 'RATS', target: 'STAR' }
  },
  4: {
    id: 4,
    title: "Foggy Mirror",
    category: 'PHYSICS',
    difficulty: 'easy',
    question: "Wipe the fog off the mirror to reveal the secret.",
    hint: "Try rubbing the screen repeatedly.",
    component: SensorPuzzle,
    config: { type: 'rub' }
  },
  5: {
    id: 5,
    title: "Count the Triangles",
    category: 'MATH',
    difficulty: 'easy',
    question: "How many triangles can you find in this figure?",
    hint: "Don't forget to count the triangles formed by smaller triangles!",
    component: CountingPuzzle
  },
  6: {
    id: 6,
    title: "Pattern Match",
    category: 'PATTERN',
    difficulty: 'easy',
    question: "Complete the pattern by selecting dots in the correct order.",
    hint: "The pattern follows a clockwise direction.",
    component: PatternPuzzle,
    config: { pattern: [0, 1, 3, 2], clockwise: true }
  },
  7: {
    id: 7,
    title: "Unscramble Me",
    category: 'KNOWLEDGE',
    difficulty: 'easy',
    question: "Unscramble the letters to find a word related to thinking.",
    hint: "It's what sits inside your skull!",
    component: AnagramPuzzle,
    config: { scrambled: 'NIRAB', answer: 'BRAIN', category: 'Anatomy' }
  },
  8: {
    id: 8,
    title: "Light the Bulb",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Turn on the light bulb. The switch might not work as expected...",
    hint: "Tapping one bulb toggles it and adjacent bulbs.",
    component: LightBulbPuzzle
  },
  9: {
    id: 9,
    title: "Number Doubles",
    category: 'MATH',
    difficulty: 'easy',
    question: "What is the next number in the sequence?",
    hint: "Each number is double the previous one.",
    component: NumberSequencePuzzle,
    config: {
      sequence: [2, 4, 8, 16, '?'],
      answer: 32,
      options: [24, 30, 32, 64]
    }
  },
  10: {
    id: 10,
    title: "Hidden Word",
    category: 'OBSERVATION',
    difficulty: 'easy',
    question: "Find the hidden word 'BRAIN' in the grid.",
    hint: "Look for the letter 'B' first.",
    component: FindObjectsPuzzle,
    config: {
      targetWord: 'BRAIN',
      grid: [
        ['B', 'X', 'O', 'L', 'P'],
        ['K', 'R', 'E', 'W', 'Q'],
        ['M', 'N', 'A', 'Z', 'S'],
        ['D', 'F', 'G', 'I', 'H'],
        ['J', 'K', 'L', 'O', 'N']
      ]
    }
  },

  // --- MEDIUM (11-20) ---
  11: {
    id: 11,
    title: "Mirror Image",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "One of these arrows is a mirror image of the others. Find it!",
    hint: "Look at the direction and the arrowhead very closely.",
    hints: ["Compare the first two arrows.", "Most point right. One points left."],
    component: LogicPuzzle,
    config: {
      items: [
        { id: 1, shape: 'icon', icon: 'arrow-right-bold', color: '#4CAF50' },
        { id: 2, shape: 'icon', icon: 'arrow-right-bold', color: '#4CAF50' },
        { id: 3, shape: 'icon', icon: 'arrow-left-bold', color: '#4CAF50' },
        { id: 4, shape: 'icon', icon: 'arrow-right-bold', color: '#4CAF50' }
      ],
      answer: 3
    }
  },
  12: {
    id: 12,
    title: "Math Magic",
    category: 'MATH',
    difficulty: 'medium',
    question: "Make 15 using three numbers.",
    hint: "Try using both addition and multiplication.",
    component: MathPuzzle,
    config: { numbers: [3, 5, 7, 1], target: 15, multipleOperators: true }
  },
  13: {
    id: 13,
    title: "Word Chain",
    category: 'KNOWLEDGE',
    difficulty: 'medium',
    question: "Start with 'COLD' and end at 'WARM', changing one letter at a time.",
    hint: "Each step must form a valid English word.",
    component: WordPuzzle,
    config: {
      word: 'COLD',
      target: 'WARM',
      type: 'wordchain',
      chain: ['COLD', 'CORD', 'WORD', 'WORM', 'WARM']
    }
  },
  14: {
    id: 14,
    title: "Kinetic Energy",
    category: 'PHYSICS',
    difficulty: 'medium',
    question: "The robot is out of power. Charge him up!",
    hint: "Physical movement creates energy. Move your phone!",
    component: SensorPuzzle,
    config: { type: 'shake' }
  },
  15: {
    id: 15,
    title: "Count the Blocks",
    category: 'MATH',
    difficulty: 'medium',
    question: "How many blocks are hidden behind the front ones?",
    hint: "Count the rows and columns to estimate the volume.",
    component: CountingPuzzle,
    config: { type: 'blocks', answer: 12 }
  },
  16: {
    id: 16,
    title: "Dot Sequence",
    category: 'PATTERN',
    difficulty: 'medium',
    question: "Connect the dots in a complex pattern.",
    hint: "Watch the sequence carefully before starting.",
    component: PatternPuzzle,
    config: { pattern: [0, 4, 8, 1, 3], clockwise: false }
  },
  17: {
    id: 17,
    title: "Color Sequence",
    category: 'MEMORY',
    difficulty: 'medium',
    question: "Repeat the color pattern shown.",
    hint: "Pay attention to the order of colors!",
    component: ColorPuzzle,
    config: { sequence: ['red', 'blue', 'yellow', 'green'], showInitialPattern: true }
  },
  18: {
    id: 18,
    title: "Warm Up",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "Turn on all the bulbs. They might need a little warming up!",
    hint: "Sometimes you need to warm up the bulb first. Try tapping it multiple times!",
    component: LightBulbPuzzle,
    config: { warmUpTaps: 4, warmUpBulbs: [0, 4] }
  },
  19: {
    id: 19,
    title: "Anagram Master",
    category: 'KNOWLEDGE',
    difficulty: 'medium',
    question: "Unscramble these letters to find a programming term.",
    hint: "It's what you're doing right now!",
    component: AnagramPuzzle,
    config: { scrambled: 'GICODN', answer: 'CODING', category: 'Technology' }
  },
  20: {
    id: 20,
    title: "Word Hunt",
    category: 'OBSERVATION',
    difficulty: 'medium',
    question: "Find the hidden word 'MASTER' in the grid.",
    hint: "It might be vertical!",
    component: FindObjectsPuzzle,
    config: {
      targetWord: 'MASTER',
      grid: [
        ['M', 'A', 'S', 'T', 'E', 'R'],
        ['Q', 'W', 'E', 'R', 'T', 'Y'],
        ['U', 'I', 'O', 'P', 'A', 'S'],
        ['D', 'F', 'G', 'H', 'J', 'K'],
        ['L', 'Z', 'X', 'C', 'V', 'B']
      ]
    }
  },

  // --- HARD (21-35) ---
  21: {
    id: 21,
    title: "Logic Grid",
    category: 'LOGIC',
    difficulty: 'hard',
    question: "One of these is not like the others.",
    hint: "Look at the number of sides or the symmetry.",
    component: LogicPuzzle,
    config: {
      items: [
        { id: 1, shape: 'square', color: '#2196F3' },
        { id: 2, shape: 'square', color: '#2196F3' },
        { id: 3, shape: 'circle', color: '#2196F3' },
        { id: 4, shape: 'square', color: '#2196F3' }
      ],
      answer: 3
    }
  },
  22: {
    id: 22,
    title: "Target Sum",
    category: 'MATH',
    difficulty: 'hard',
    question: "Use all numbers to reach 24.",
    hint: "Try using multiplication on the larger numbers.",
    component: MathPuzzle,
    config: { numbers: [4, 6, 8, 2], target: 24, multipleOperators: true }
  },
  23: {
    id: 23,
    title: "Emoji Math",
    category: 'MATH',
    difficulty: 'hard',
    question: "Solve for the values of the emojis.",
    hint: "Solve the first equation to find the value of the Apple.",
    component: MathPuzzle,
    config: {
      type: 'emoji',
      equations: [
        { emoji: ['🍎', '🍎'], result: 10 },
        { emoji: ['🍎', '🍌'], result: 12 }
      ],
      solution: { '🍎': 5, '🍌': 7 }
    }
  },
  24: {
    id: 24,
    title: "Sleeping Owl",
    category: 'PHYSICS',
    difficulty: 'hard',
    question: "It's too bright for the owl. Help him sleep!",
    hint: "What happens when it's dark? Try hiding the screen.",
    component: SensorPuzzle,
    config: { type: 'flip' }
  },
  25: {
    id: 25,
    title: "Prime Sequence",
    category: 'MATH',
    difficulty: 'hard',
    question: "What is the next number in this sequence?",
    hint: "These numbers are only divisible by 1 and themselves.",
    component: NumberSequencePuzzle,
    config: {
      sequence: [2, 3, 5, 7, 11, '?'],
      answer: 13,
      options: [12, 13, 14, 15]
    }
  },
  26: {
    id: 26,
    title: "Balance Act",
    category: 'PHYSICS',
    difficulty: 'hard',
    question: "Keep the ball in the center of the beam.",
    hint: "Tilt your phone left and right to balance.",
    component: SensorPuzzle,
    config: { type: 'tilt' }
  },
  27: {
    id: 27,
    title: "Expert Colors",
    category: 'MEMORY',
    difficulty: 'hard',
    question: "Repeat the very long color sequence.",
    hint: "Focus on the rhythm of the flashes.",
    component: ColorPuzzle,
    config: { sequence: ['red', 'blue', 'yellow', 'green', 'red', 'blue'], showInitialPattern: true }
  },
  28: {
    id: 28,
    title: "Hot Soup",
    category: 'PHYSICS',
    difficulty: 'hard',
    question: "The soup is steaming hot! Cool it down.",
    hint: "How do you cool down food? Try blowing on it.",
    component: SensorPuzzle,
    config: { type: 'mic' }
  },
  29: {
    id: 29,
    title: "Gravity Flip",
    category: 'PHYSICS',
    difficulty: 'hard',
    question: "The ball is stuck. The only exit is at the TOP.",
    hint: "If you want things to fall 'up', what should you do with the phone?",
    component: SensorPuzzle,
    config: { type: 'upside-down' }
  },
  30: {
    id: 30,
    title: "Radio Frequency",
    category: 'PHYSICS',
    difficulty: 'hard',
    question: "Tune the radio to find the secret station.",
    hint: "Rotate your phone like a dial to search for the signal.",
    component: SensorPuzzle,
    config: { type: 'rotate' }
  },
  31: {
    id: 31,
    title: "Safe Guard",
    category: 'LOGIC',
    difficulty: 'hard',
    question: "Hold your thumb on the scanner to unlock the vault.",
    hint: "You need to be patient. Don't let go!",
    component: SensorPuzzle,
    config: { type: 'long-press' }
  },
  32: {
    id: 32,
    title: "The Water Pump",
    category: 'PHYSICS',
    difficulty: 'hard',
    question: "Pump the water to fill the tank!",
    hint: "Tap the pump as fast as you can!",
    component: SensorPuzzle,
    config: { type: 'rapid-tap' }
  },
  33: {
    id: 33,
    title: "The Secret Lock",
    category: 'LOGIC',
    difficulty: 'hard',
    question: "Unlock the secret combination.",
    hint: "Tap the pattern lock several times to unlock it.",
    component: SensorPuzzle,
    config: { type: 'pattern-swipe' }
  },
  34: {
    id: 34,
    title: "Fibonacci Fun",
    category: 'MATH',
    difficulty: 'hard',
    question: "Complete the sequence: 1, 1, 2, 3, 5, 8, ?",
    hint: "Each number is the sum of the two preceding ones.",
    component: NumberSequencePuzzle,
    config: {
      sequence: [1, 1, 2, 3, 5, 8, '?'],
      answer: 13,
      options: [10, 11, 12, 13]
    }
  },
  35: {
    id: 35,
    title: "Final Word Hunt",
    category: 'OBSERVATION',
    difficulty: 'hard',
    question: "Find the hidden word 'BRAINMASTER' in the grid.",
    hint: "It's a long word! Look for the 'B' first.",
    component: FindObjectsPuzzle,
    config: {
      targetWord: 'BRAINMASTER',
      grid: [
        ['B', 'R', 'A', 'I', 'N', 'M', 'A', 'S', 'T', 'E', 'R'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A'],
        ['U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J'],
        ['D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V'],
        ['L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E']
      ]
    }
  }
};

export const getLevelData = (levelId: number): Level | null => {
  return levels[levelId] || null;
};