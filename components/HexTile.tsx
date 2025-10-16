import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type TileType = 'empty' | 'forest' | 'mountain' | 'city';
export type TileOwner = 'player' | 'enemy' | null;

interface HexTileProps {
  type: TileType;
  owner: TileOwner;
  resources: number;
  onPress: () => void;
  position: { x: number; y: number };
}

const getIconForType = (type: TileType) => {
  switch (type) {
    case 'forest':
      return 'tree';
    case 'mountain':
      return 'mountain';
    case 'city':
      return 'city';
    default:
      return 'hexagon-outline';
  }
};

export const HexTile: React.FC<HexTileProps> = ({ type, owner, resources, onPress, position }) => {
  const { x, y } = position;
  const offset = x % 2 === 0 ? 0 : 30; // Offset every other row

  return (
    <TouchableOpacity
      style={[
        styles.hexTile,
        { 
          top: y * 60 + offset,
          left: x * 52,
          backgroundColor: owner === 'player' ? '#4CAF50' : 
                         owner === 'enemy' ? '#F44336' : '#E0E0E0'
        }
      ]}
      onPress={onPress}
    >
      <MaterialCommunityIcons 
        name={getIconForType(type)} 
        size={24} 
        color={owner ? 'white' : '#666'} 
      />
      {resources > 0 && (
        <Text style={styles.resourceText}>{resources}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hexTile: {
    width: 60,
    height: 60,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resourceText: {
    position: 'absolute',
    bottom: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});