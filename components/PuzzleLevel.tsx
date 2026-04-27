import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from 'sonner-native';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  onLevelSelect?: () => void;
  children: React.ReactNode;
}

const motivationalMessages = [
  "Your brain just got a little wrinklier! 🧠",
  "Einstein would be mildly impressed! 👨‍🔬",
  "You're smarter than 99% of smartphones! 📱",
  "Your IQ just went up by 0.01 points! 📈",
  "Congratulations! You outsmarted the puzzle! 🎉",
  "Your brain cells are high-fiving each other! 🙌",
  "That was the easiest level... just kidding! 😉",
  "You've unlocked: Basic Problem Solving! ✨",
  "Neurons: activated. Coffee: still needed. ☕",
  "Logic: 1, Confusion: 0! 🏆",
  "You're officially smarter than yesterday's you! 📆",
  "That puzzle didn't stand a chance! 💪",
  "You're on fire! Not literally, that would be concerning. 🔥",
  "Puzzle: defeated. Snack time: activated. 🍪",
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
  onLevelSelect,
  children
}) => {
  const [bulbs, setBulbs] = useState(5);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [showSkipScreen, setShowSkipScreen] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('bulbs').then(stored => {
      if (stored) setBulbs(parseInt(stored));
    });
  }, []);

  // Reset state when level changes
  useEffect(() => {
    setShowCompletionScreen(false);
    setShowSkipScreen(false);
    setHintUsed(false);
    setShowHint(false);
  }, [level]);

  useEffect(() => {
    if (isComplete && !showCompletionScreen) {
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
    } else {
      toast.error('No bulbs left! Complete more levels to earn bulbs.');
    }
  };

  const handleSkip = () => {
    if (bulbs >= 3) {
      saveBulbs(bulbs - 3);
      setShowSkipScreen(true);
      onSkip();
    } else {
      toast.error('Need 3 bulbs to skip!');
    }
  };

  const handleWatchAd = () => {
    saveBulbs(bulbs + 2);
    toast.success('+2 bulbs added!');
    onWatchAd();
  };

  const handleNextLevel = () => {
    setShowCompletionScreen(false);
    setShowSkipScreen(false);
    onNextLevel();
  };

  return (
    <View style={styles.container}>
      {/* Compact header - single row */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={onGoHome} style={styles.iconButton} accessibilityLabel="Home">
            <MaterialCommunityIcons name="home" size={22} color="#fff" />
          </Pressable>
          {onLevelSelect && (
            <Pressable onPress={onLevelSelect} style={styles.iconButton} accessibilityLabel="Level select">
              <MaterialCommunityIcons name="view-grid" size={22} color="#fff" />
            </Pressable>
          )}
          <Text style={styles.levelText}>Lvl {level}</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.bulbContainer}>
            <MaterialCommunityIcons name="lightbulb" size={14} color="#FFD700" />
            <Text style={styles.bulbCount}>{bulbs}</Text>
          </View>
          <Pressable onPress={handleHintPress} style={styles.iconButton} accessibilityLabel="Hint">
            <MaterialCommunityIcons name="lightbulb-outline" size={22} color="#FFD700" />
          </Pressable>
          <Pressable onPress={handleSkip} style={styles.iconButton} accessibilityLabel="Skip">
            <MaterialCommunityIcons name="skip-next" size={22} color="#fff" />
          </Pressable>
          <Pressable onPress={onExit} style={styles.iconButton} accessibilityLabel="Exit">
            <MaterialCommunityIcons name="exit-to-app" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>

      <Text style={styles.question}>{question}</Text>

      <View style={styles.puzzleContainer}>
        {children}
      </View>

      {/* Hint overlay — plain View, NO Animated.View entering/exiting */}
      {showHint && (
        <View style={styles.overlay}>
          <View style={styles.popupCard}>
            <Text style={styles.popupTitle}>💡 Hint</Text>
            <Text style={styles.hintText}>{hint}</Text>
            <Pressable onPress={() => setShowHint(false)} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Completion popup — plain View, NO Animated.View */}
      {showCompletionScreen && (
        <View style={styles.overlay}>
          <View style={styles.popupCard}>
            <Text style={styles.completionTitle}>Level Complete! 🎉</Text>
            <Text style={styles.motivationalMessage}>{motivationalMessage}</Text>

            {!hintUsed && (
              <View style={styles.bonusContainer}>
                <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
                <Text style={styles.bonusText}>No hint bonus! +1 bulb 🌟</Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Pressable style={[styles.actionButton, styles.nextButton]} onPress={handleNextLevel}>
                <Text style={styles.buttonText}>Next Level</Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
              </Pressable>
              <Pressable style={[styles.actionButton, styles.adButton]} onPress={handleWatchAd}>
                <Text style={styles.buttonText}>Watch Ad (+2 💡)</Text>
                <MaterialCommunityIcons name="video" size={18} color="#fff" />
              </Pressable>
              <Pressable style={[styles.actionButton, styles.exitButton]} onPress={onExit}>
                <Text style={styles.buttonText}>Exit</Text>
                <MaterialCommunityIcons name="exit-to-app" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Skip popup — plain View, NO Animated.View */}
      {showSkipScreen && (
        <View style={styles.overlay}>
          <View style={styles.popupCard}>
            <Text style={styles.completionTitle}>Level Skipped ⏭️</Text>
            <Text style={styles.motivationalMessage}>
              Sometimes it's better to move on and come back later!
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable style={[styles.actionButton, styles.nextButton]} onPress={handleNextLevel}>
                <Text style={styles.buttonText}>Next Level</Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
              </Pressable>
              <Pressable style={[styles.actionButton, styles.exitButton]} onPress={onExit}>
                <Text style={styles.buttonText}>Exit</Text>
                <MaterialCommunityIcons name="exit-to-app" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'nowrap',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
  },
  iconButton: {
    padding: 6,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  bulbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    marginRight: 2,
  },
  bulbCount: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 13,
  },
  question: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  puzzleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Full-screen dark overlay — replaces BlurView/Animated.View
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 20,
  },
  popupCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 14,
  },
  hintText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  motivationalMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  bonusText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  adButton: {
    backgroundColor: '#2196F3',
  },
  exitButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});