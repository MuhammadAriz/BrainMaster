import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GameStatsProps {
  resources: number;
  territory: number;
  turn: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ resources, territory, turn }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.stat}>Resources: {resources}</Text>
      <Text style={styles.stat}>Territory: {territory}</Text>
      <Text style={styles.stat}>Turn: {turn}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  stat: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});