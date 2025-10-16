import React, { useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PuzzleLevel } from '../components/PuzzleLevel';
import { getLevelData } from '../utils/levelData';
import { toast } from 'sonner-native';

export default function GameLevelScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const levelId = route.params?.levelId;
  const [levelData, setLevelData] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const levelInfo = getLevelData(levelId);
    setLevelData(levelInfo);
    // Reset completion state when level changes
    setIsComplete(false);

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [levelId]);

  const handleLevelComplete = async () => {
    setIsComplete(true);
    
    try {
      // Award bonus bulb if no hint was used
      const bulbs = await AsyncStorage.getItem('bulbs');
      const currentBulbs = bulbs ? parseInt(bulbs) : 5;
      await AsyncStorage.setItem('bulbs', (currentBulbs + 1).toString());
      
      // Save level progress
      const progress = await AsyncStorage.getItem('levelProgress');
      const savedProgress = progress ? JSON.parse(progress) : {};
      
      savedProgress[levelId] = {
        completed: true,
        stars: 3,
        completedAt: new Date().toISOString()
      };

      await AsyncStorage.setItem('levelProgress', JSON.stringify(savedProgress));
      
      // Show success message
      toast.success('Level completed! +1 bulb bonus');
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleSkip = () => {
    // Mark level as skipped with 1 star
    handleLevelProgress(1);
    navigation.navigate('LevelSelect');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleExit = () => {
    navigation.navigate('Home');
  };

  const handleNextLevel = () => {
    // Navigate to the next level
    const nextLevelId = levelId + 1;
    const nextLevelData = getLevelData(nextLevelId);
    
    if (nextLevelData) {
      // If next level exists, navigate to it
      navigation.navigate('GameLevel', { levelId: nextLevelId });
    } else {
      // If this was the last level, go to level select
      toast.success('You completed all available levels!');
      navigation.navigate('LevelSelect');
    }
  };

  const handleWatchAd = () => {
    // Simulate watching an ad
    toast.success('Thanks for watching an ad! +2 bulbs');
    // The actual bulb reward is handled in the PuzzleLevel component
  };

  const handleLevelProgress = async (stars) => {
    try {
      const progress = await AsyncStorage.getItem('levelProgress');
      const savedProgress = progress ? JSON.parse(progress) : {};
      
      savedProgress[levelId] = {
        completed: stars === 3,
        skipped: stars === 1,
        stars: stars,
        completedAt: new Date().toISOString()
      };

      await AsyncStorage.setItem('levelProgress', JSON.stringify(savedProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  if (!levelData) return null;

  return (
    <View style={styles.container}>
      <PuzzleLevel
        level={levelId}
        question={levelData.question}
        hint={levelData.hint}
        isComplete={isComplete}
        onComplete={handleLevelComplete}
        onSkip={handleSkip}
        onGoHome={handleGoHome}
        onNextLevel={handleNextLevel}
        onWatchAd={handleWatchAd}
        onExit={handleExit}
      >
        {React.createElement(levelData.component, {
          onComplete: handleLevelComplete,
          config: levelData.config
        })}
      </PuzzleLevel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});