import React from 'react';
import {StyleSheet, View, Image, Pressable} from 'react-native';

type ClothingCardProps = {
  imageUrl: string;
  onPress: () => void;
};

const ClothingCard = ({imageUrl, onPress}: ClothingCardProps) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{uri: imageUrl}} style={styles.image} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%', // Almost half the screen width with gap
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ClothingCard; 