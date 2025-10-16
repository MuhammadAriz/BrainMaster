import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from 'sonner-native';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface PuzzleLevelProps {
  level: number;
  question: string;
  hint: string;
  isComplete?: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onGoHome: () => void;
  onNextLevel: () => void;
  onWatchAd: () => void;
  onExit: () => void;
  children: React.ReactNode;
}

// Motivational messages for level completion
const motivationalMessages = [
  "Your brain just got a little wrinklier! 🧠",
  "Einstein would be mildly impressed! 👨‍🔬",
  "You're smarter than 99% of smartphones! 📱",
  "Your IQ just went up by 0.01 points! 📈",
  "Congratulations! You've outsmarted a puzzle designed for humans! 🎉",
  "Your brain cells are high-fiving each other right now! 🙌",
  "That was the easiest level... just kidding! 😉",
  "You've unlocked: Basic Problem Solving! ✨",
  "Neurons: activated. Coffee: still needed. ☕",
  "You solved it faster than a quantum computer! Well, not really, but good job! 💻",
  "Your brain just did a little happy dance! 💃",
  "Achievement unlocked: Used more than 2% of your brain! 🧠",
  "Logic: 1, Confusion: 0! 🏆",
  "You're officially smarter than yesterday's you! 📆",
  "That puzzle didn't stand a chance against your mighty brain cells! 💪",
  "If puzzles could feel, this one would be embarrassed! 😳",
  "Your problem-solving skills are almost as good as your pizza-ordering skills! 🍕",
  "You're on fire! Not literally, that would be concerning. 🔥",
  "Puzzle: defeated. Snack time: activated. 🍪",
  "You make puzzle-solving look easy! (It's not, we checked) 👌"
];

export const PuzzleLevel: React.FC<PuzzleLevelProps> = ({
  level,
  question,
  hint,
  isComplete = false,
  onComplete,
  onSkip,
  onGoHome,
  onNextLevel,
  onWatchAd,
  onExit,
  children
}) => {
  const [bulbs, setBulbs] = useState(5); // Start with 5 bulbs
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('bulbs').then(stored => {
      if (stored) setBulbs(parseInt(stored));
    });
  }, []);

  // Reset state when level changes
  useEffect(() => {
    setShowCompletionScreen(false);
    setHintUsed(false);
    setShowHint(false);
    setCurrentHintIndex(0);
  }, [level]);

  useEffect(() => {
    if (isComplete && !showCompletionScreen) {
      // Select a random motivational message
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      setMotivationalMessage(motivationalMessages[randomIndex]);
      setShowCompletionScreen(true);
    }
  }, [isComplete]);

  const saveBulbs = async (count: number) => {
    await AsyncStorage.setItem('bulbs', count.toString());
    setBulbs(count);
  };

  const handleHintPress = () => {
    if (bulbs > 0) {
      saveBulbs(bulbs - 1);
      setShowHint(true);
      setHintUsed(true);
      setCurrentHintIndex(prev => prev + 1);
    } else {
      toast.error('No bulbs left! Complete more levels to earn bulbs.');
    }
  };

  const handleSkip = () => {
    if (bulbs >= 3) {
      saveBulbs(bulbs - 3);
      onSkip();
    } else {
      toast.error('Need 3 bulbs to skip! Complete more levels to earn bulbs.');
    }
  };

  const handleWatchAd = () => {
    // Add bulbs as reward for watching ad
    saveBulbs(bulbs + 2);
    toast.success('Thanks for watching! +2 bulbs added');
    onWatchAd();
  };

  const handleNextLevel = () => {
    setShowCompletionScreen(false);
    onNextLevel();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable 
            onPress={onGoHome} 
            style={styles.iconButton}
            accessibilityLabel="Go to home screen"
          >
            <MaterialCommunityIcons name="home" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.bulbContainer}>
            <MaterialCommunityIcons name="lightbulb" size={18} color="#FFD700" />
            <Text style={styles.bulbCount}>{bulbs}</Text>
          </View>
          <Pressable 
            onPress={handleHintPress} 
            style={styles.iconButton}
            accessibilityLabel="Show hint"
          >
            <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#FFD700" />
          </Pressable>
          <Pressable 
            onPress={handleSkip} 
            style={styles.iconButton}
            accessibilityLabel="Skip level"
          >
            <MaterialCommunityIcons name="skip-next" size={24} color="#fff" />
          </Pressable>
          <Pressable 
            onPress={onExit} 
            style={styles.iconButton}
            accessibilityLabel="Exit game"
          >
            <MaterialCommunityIcons name="exit-to-app" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
      
      <Text style={styles.question}>{question}</Text>
      
      <View style={styles.puzzleContainer}>
        {children}
      </View>

      {showHint && (
        <Animated.View 
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.hintContainer}
        >
          <BlurView intensity={90} style={styles.hintBlur}>
            <Text style={styles.hintText}>{hint}</Text>
            <Pressable onPress={() => setShowHint(false)} style={styles.closeHint}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </Pressable>
          </BlurView>
        </Animated.View>
      )}

      {showCompletionScreen && (
        <Animated.View 
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.completionScreen}
        >
          <BlurView intensity={90} style={styles.completionBlur}>
            <Text style={styles.completionTitle}>Level Complete! 🎉</Text>
            <Text style={styles.motivationalMessage}>{motivationalMessage}</Text>
            
            {!hintUsed && (
              <View style={styles.bonusContainer}>
                <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                <Text style={styles.bonusText}>+Bonus: No hint used! +1 bulb</Text>
              </View>
            )}
            
            <View style={styles.buttonContainer}>
              <Pressable 
                style={[styles.actionButton, styles.nextButton]} 
                onPress={handleNextLevel}
              >
                <Text style={styles.buttonText}>Next Level</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
              </Pressable>
              
              <Pressable 
                style={[styles.actionButton, styles.adButton]} 
                onPress={handleWatchAd}
              >
                <Text style={styles.buttonText}>Watch Ad (+2 bulbs)</Text>
                <MaterialCommunityIcons name="video" size={20} color="#fff" />
              </Pressable>
              
              <Pressable 
                style={[styles.actionButton, styles.exitButton]} 
                onPress={onExit}
              >
                <Text style={styles.buttonText}>Exit</Text>
                <MaterialCommunityIcons name="exit-to-app" size={20} color="#fff" />
              </Pressable>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bulbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  bulbCount: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  question: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  puzzleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 10,
  },
  hintBlur: {
    padding: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
  },
  hintText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeHint: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  completeBanner: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  completeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bonusText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
  completionScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 20,
  },
  completionBlur: {
    padding: 30,
    borderRadius: 20,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  motivationalMessage: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 25,
    gap: 10,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  adButton: {
    backgroundColor: '#2196F3',
  },
  exitButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});