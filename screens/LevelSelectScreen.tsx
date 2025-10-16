import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface LevelData {
  id: number;
  title: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  stars: number;
}

export default function LevelSelectScreen() {
  const navigation = useNavigation();
  const [levels, setLevels] = React.useState<LevelData[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadLevelProgress();
    }, [])
  );

  const loadLevelProgress = async () => {
    try {
      const progress = await AsyncStorage.getItem('levelProgress');
      const savedProgress = progress ? JSON.parse(progress) : {};
      
      // Generate levels with saved progress
      const generatedLevels = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Level ${i + 1}`,
        type: getLevelType(i + 1),
        difficulty: getLevelDifficulty(i + 1),
        completed: savedProgress[i + 1]?.completed || false,
        stars: savedProgress[i + 1]?.stars || 0,
      }));

      setLevels(generatedLevels);
    } catch (error) {
      console.error('Error loading level progress:', error);
    }
  };

  const getLevelType = (level: number): string => {
    const types = ['Logic', 'Visual', 'Math', 'Word', 'Memory', 'Pattern'];
    return types[level % types.length];
  };

  const getLevelDifficulty = (level: number): 'easy' | 'medium' | 'hard' => {
    if (level <= 33) return 'easy';
    if (level <= 66) return 'medium';
    return 'hard';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Select Level</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.levelsGrid}>
          {levels.map((level) => (
            <Pressable
              key={level.id}
              style={[
                styles.levelButton,
                level.completed && styles.completedLevel
              ]}
              onPress={() => navigation.navigate('GameLevel', { levelId: level.id })}
            >
              <Text style={styles.levelNumber}>{level.id}</Text>
              <Text style={styles.levelType}>{level.type}</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3].map((star) => (
                  <MaterialCommunityIcons
                    key={star}
                    name="star"
                    size={12}
                    color={star <= level.stars ? '#FFD700' : '#333'}
                  />
                ))}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
  levelButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  completedLevel: {
    backgroundColor: '#4CAF50',
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelType: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 5,
  },
});