import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';

type ClothingCardProps = {
  imageUrl: string;
  onPress: () => void;
  onLongPress: () => void;
};

const ClothingCard = ({ imageUrl, onPress, onLongPress }: ClothingCardProps) => {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Adjusted width for proper grid layout
    height: 180,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12, // Space between rows

  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ClothingCard;
