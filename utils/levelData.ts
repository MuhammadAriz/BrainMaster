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
  category: 'MATH' | 'PHYSICS' | 'LOGIC' | 'KNOWLEDGE' | 'SORTING' | 'STRATEGY';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  hint: string;
  hints?: string[];
  component: React.ComponentType<any>;
  config?: any;
}

const levels: Record<number, Level> = {
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
    hint: "Tapping one bulb toggles it and adjacent bulbs.",
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
    question: "Create an equation that equals 10 using the numbers provided.",
    hint: "Try combining addition and multiplication.",
    component: MathPuzzle,
    config: {
      numbers: [2, 3, 4, 5],
      target: 10,
      multipleOperators: true
    }
  },
  6: {
    id: 6,
    title: "Color Sequence",
    category: 'LOGIC',
    difficulty: 'easy',
    question: "Repeat the color pattern shown.",
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
    question: "Complete the pattern by selecting dots in the correct order.",
    hint: "The pattern follows a clockwise direction.",
    component: PatternPuzzle,
    config: {
      pattern: [0, 1, 3, 2],
      clockwise: true
    }
  },
  8: {
    id: 8,
    title: "Math Magic",
    category: 'MATH',
    difficulty: 'easy',
    question: "Make 15 using three numbers.",
    hint: "Try using both addition and multiplication.",
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
    question: "Make 'STOP' from 'POST'.",
    hint: "Think about how letters can be rearranged.",
    component: WordPuzzle,
    config: {
      word: 'POST',
      target: 'STOP'
    }
  },
  10: {
    id: 10,
    title: "Warm Up",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "Turn on all the bulbs. They might need a little warming up!",
    hint: "Sometimes you need to warm up the bulb first. Try tapping it multiple times!",
    component: LightBulbPuzzle,
    config: {
      warmUpTaps: 4,
      warmUpBulbs: [0, 4]
    }
  },
  11: {
    id: 11,
    title: "Mirror Image",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "One of these arrows is a mirror image of the others. Find it!",
    hint: "Look at the direction and the arrowhead very closely.",
    hints: [
      "Compare the first two arrows.",
      "Most point right. One points left.",
      "Look for the reversed orientation."
    ],
    component: LogicPuzzle,
    config: {
      items: [
        { id: 1, shape: 'icon', icon: 'arrow-right-bold', color: '#4CAF50' },
        { id: 2, shape: 'icon', icon: 'arrow-right-bold', color: '#4CAF50' },
        { id: 3, shape: 'icon', icon: 'arrow-left-bold', color: '#4CAF50' },
        { id: 4, shape: 'icon', icon: 'arrow-right-bold', color: '#4CAF50' },
        { id: 5, shape: 'icon', icon: 'arrow-right-bold', color: '#4CAF50' },
        { id: 6, shape: 'icon', icon: 'arrow-right-bold', color: '#4CAF50' }
      ],
      answer: 3
    }
  },
  12: {
    id: 12,
    title: "Next Number",
    category: 'MATH',
    difficulty: 'medium',
    question: "Find the missing number in the sequence.",
    hint: "Look at the difference between consecutive numbers.",
    hints: [
      "2 to 4 is +2.",
      "4 to 8 is +4.",
      "It seems to be doubling each time."
    ],
    component: NumberSequencePuzzle,
    config: {
      sequence: [2, 4, 8, 16, '?'],
      answer: 32,
      options: [24, 30, 32, 40]
    }
  },
  13: {
    id: 13,
    title: "Unscramble Me",
    category: 'KNOWLEDGE',
    difficulty: 'medium',
    question: "Unscramble the letters to find a word related to thinking.",
    hint: "It's what sits inside your skull!",
    hints: [
      "Starts with B.",
      "It has 5 letters.",
      "Rhymes with rain."
    ],
    component: AnagramPuzzle,
    config: {
      scrambled: 'NIRAB',
      answer: 'BRAIN',
      category: 'Anatomy'
    }
  },
  14: {
    id: 14,
    title: "Word Chain",
    category: 'LOGIC',
    difficulty: 'easy',
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
  15: {
    id: 15,
    title: "Target Sum",
    category: 'MATH',
    difficulty: 'medium',
    question: "Use all numbers to reach 24.",
    hint: "Try using multiplication on the larger numbers.",
    hints: [
      "6 times 4 is 24.",
      "How can you get 4 from 1, 3, and 6?",
      "Wait, use all numbers: (6+6) * (3-1) = 24? No, use [4, 6, 8, 2]."
    ],
    component: MathPuzzle,
    config: {
      numbers: [4, 6, 8, 2],
      target: 24,
      multipleOperators: true
    }
  },
  16: {
    id: 16,
    title: "Double Pattern",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "Find the missing number in this alternating sequence.",
    hint: "There are two separate patterns interleaved.",
    hints: [
      "Look at every other number: 1, 2, 3...",
      "Now look at the other ones: 10, 20, 30...",
      "What comes after 30?"
    ],
    component: NumberSequencePuzzle,
    config: {
      sequence: [1, 10, 2, 20, 3, 30, '?'],
      answer: 4,
      options: [4, 40, 5, 50],
      ruleHint: "Two sequences in one!"
    }
  },
  17: {
    id: 17,
    title: "Anagram Master",
    category: 'KNOWLEDGE',
    difficulty: 'medium',
    question: "Unscramble these letters to find a programming term.",
    hint: "It's what you're doing right now!",
    component: AnagramPuzzle,
    config: {
      scrambled: 'GICODN',
      answer: 'CODING',
      category: 'Technology'
    }
  },
  18: {
    id: 18,
    title: "Triple Choice",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "Which emoji is the odd one out?",
    hint: "Look at the category of the emojis.",
    hints: [
      "We have fruits and one... thing.",
      "Apples, Bananas, Cherries...",
      "A pizza is not a simple fruit!"
    ],
    component: LogicPuzzle,
    config: {
      items: [
        { id: 1, shape: 'emoji', emoji: '🍎' },
        { id: 2, shape: 'emoji', emoji: '🍌' },
        { id: 3, shape: 'emoji', emoji: '🍕' },
        { id: 4, shape: 'emoji', emoji: '🍒' },
        { id: 5, shape: 'emoji', emoji: '🍇' },
        { id: 6, shape: 'emoji', emoji: '🍓' }
      ],
      answer: 3
    }
  },
  19: {
    id: 19,
    title: "Hidden Word",
    category: 'KNOWLEDGE',
    difficulty: 'medium',
    question: "Find the hidden word 'BRAIN' in the grid.",
    hint: "Tap letters in sequence. It might be diagonal!",
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
  20: {
    id: 20,
    title: "Emoji Math",
    category: 'MATH',
    difficulty: 'medium',
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
  21: {
    id: 21,
    title: "Prime Sequence",
    category: 'MATH',
    difficulty: 'hard',
    question: "What is the next number in this sequence?",
    hint: "These numbers are only divisible by 1 and themselves.",
    hints: [
      "Think about Prime numbers.",
      "2, 3, 5, 7, 11...",
      "What is the next prime after 11?"
    ],
    component: NumberSequencePuzzle,
    config: {
      sequence: [2, 3, 5, 7, 11, '?'],
      answer: 13,
      options: [12, 13, 14, 15]
    }
  },
  22: {
    id: 22,
    title: "Fruit Salad",
    category: 'KNOWLEDGE',
    difficulty: 'medium',
    question: "Unscramble the name of this tropical fruit.",
    hint: "It has a rough skin and a crown.",
    component: AnagramPuzzle,
    config: {
      scrambled: 'EPPALNEPI',
      answer: 'PINEAPPLE',
      category: 'Food'
    }
  },
  23: {
    id: 23,
    title: "Logic Grid",
    category: 'LOGIC',
    difficulty: 'hard',
    question: "One of these is not like the others.",
    hint: "Look at the number of sides or the symmetry.",
    hints: [
      "Count the sides of each shape.",
      "Square(4), Triangle(3), Pentagon(5)...",
      "Look at the color patterns if sides are equal."
    ],
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
  24: {
    id: 24,
    title: "Fibonacci Fun",
    category: 'MATH',
    difficulty: 'hard',
    question: "Complete the sequence: 1, 1, 2, 3, 5, 8, ?",
    hint: "Each number is the sum of the two preceding ones.",
    hints: [
      "1 + 1 = 2",
      "2 + 3 = 5",
      "What is 5 + 8?"
    ],
    component: NumberSequencePuzzle,
    config: {
      sequence: [1, 1, 2, 3, 5, 8, '?'],
      answer: 13,
      options: [10, 11, 12, 13]
    }
  },
  25: {
    id: 25,
    title: "Word Hunt",
    category: 'KNOWLEDGE',
    difficulty: 'hard',
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
  26: {
    id: 26,
    title: "Foggy Mirror",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "Wipe the fog off the mirror to reveal the secret.",
    hint: "Try rubbing the screen repeatedly.",
    component: SensorPuzzle,
    config: { type: 'rub' }
  },
  27: {
    id: 27,
    title: "Sleeping Owl",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "It's too bright for the owl. Help him sleep!",
    hint: "What happens when it's dark? Try hiding the screen.",
    hints: [
        "Owls sleep when it's dark.",
        "Try turning your phone face down.",
        "Keep it dark for a few seconds."
    ],
    component: SensorPuzzle,
    config: { type: 'flip' }
  },
  28: {
    id: 28,
    title: "Kinetic Energy",
    category: 'PHYSICS',
    difficulty: 'medium',
    question: "The robot is out of power. Charge him up!",
    hint: "Physical movement creates energy. Move your phone!",
    component: SensorPuzzle,
    config: { type: 'shake' }
  },
  29: {
    id: 29,
    title: "Safe Guard",
    category: 'LOGIC',
    difficulty: 'hard',
    question: "Hold your thumb on the scanner to unlock the vault.",
    hint: "You need to be patient. Don't let go!",
    component: SensorPuzzle,
    config: { type: 'long-press' }
  },
  30: {
    id: 30,
    title: "Hot Soup",
    category: 'PHYSICS',
    difficulty: 'medium',
    question: "The soup is steaming hot! Cool it down.",
    hint: "How do you cool down food? Try blowing on it.",
    component: SensorPuzzle,
    config: { type: 'mic' }
  },
  31: {
    id: 31,
    title: "Balance Act",
    category: 'PHYSICS',
    difficulty: 'hard',
    question: "Keep the ball in the center of the beam.",
    hint: "Tilt your phone left and right to balance.",
    component: SensorPuzzle,
    config: { type: 'tilt' }
  },
  32: {
    id: 32,
    title: "Gravity Flip",
    category: 'PHYSICS',
    difficulty: 'medium',
    question: "The ball is stuck. The only exit is at the TOP.",
    hint: "If you want things to fall 'up', what should you do with the phone?",
    component: SensorPuzzle,
    config: { type: 'upside-down' }
  },
  33: {
    id: 33,
    title: "Radio Frequency",
    category: 'LOGIC',
    difficulty: 'hard',
    question: "Tune the radio to find the secret station.",
    hint: "Rotate your phone like a dial to search for the signal.",
    component: SensorPuzzle,
    config: { type: 'rotate' }
  },
  34: {
    id: 34,
    title: "The Water Pump",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "Pump the water to fill the tank!",
    hint: "Tap the pump as fast as you can!",
    component: SensorPuzzle,
    config: { type: 'rapid-tap' }
  },
  35: {
    id: 35,
    title: "The Secret Lock",
    category: 'LOGIC',
    difficulty: 'medium',
    question: "Unlock the secret combination.",
    hint: "Tap the pattern lock several times to unlock it.",
    component: SensorPuzzle,
    config: { type: 'pattern-swipe' }
  }
};

export const getLevelData = (levelId: number): Level | null => {
  return levels[levelId] || null;
};