import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Text, IconButton, TextInput, Icon } from 'react-native-paper';
import SafeScreen from '../../components/SafeScreen';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';

const occasions = [
  'Casual Outing',
  'Formal Occasion',
  'Business Meeting',
  'Date Night',
  'Wedding',
  'Workout',
  'Travel',
  'Festival',
  'Beach Day',
  'Winter Outdoor',
];

const OccasionSelectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'OccasionSelect'>>();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customOccasion, setCustomOccasion] = useState('');

  const handleSelect = (occasion: string) => {
    route.params.onSelect(occasion);
    navigation.goBack();
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineSmall" style={styles.title}>
            Select Occasion
          </Text>
        </View>

        {/* OCCASION LIST */}
        <ScrollView style={styles.occasionList}>
          {occasions.map((occasion, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.occasionItem,
                pressed && styles.occasionItemPressed,
              ]}
              onPress={() => handleSelect(occasion)}
            >
              <Text style={styles.occasionText}>{occasion}</Text>
            </Pressable>
          ))}
          
          {/* CUSTOM OCCASION BUTTON */}
          <Pressable
            style={({ pressed }) => [
              styles.occasionItem,
              pressed && styles.occasionItemPressed,
            ]}
            onPress={() => setShowCustomInput(true)}
          >
            <Text style={styles.occasionText}>+ Custom Occasion</Text>
          </Pressable>
        </ScrollView>

        {/* CUSTOM OCCASION INPUT FIELD */}
        {showCustomInput && (
          <View style={styles.customInputContainer}>
            <TextInput
              mode="outlined"
              label="Enter custom occasion"
              value={customOccasion}
              onChangeText={setCustomOccasion}
              style={styles.customInput}
              outlineColor="#843CA7"
              activeOutlineColor="#843CA7"
              right={
                <TextInput.Icon
                  icon="check"
                  onPress={() => {
                    if (customOccasion.trim()) {
                      handleSelect(customOccasion);
                    }
                  }}
                  color="#843CA7"
                />
              }
            />
          </View>
        )}
      </View>
    </SafeScreen>
  );
};

/* 📌 STYLING UPDATES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',  // Updated Background Color
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    
  },
  title: {
    color: '#843CA7',
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 48, // Ensures title is centered
  },

  /* OCCASION LIST */
  occasionList: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  occasionItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  occasionItemPressed: {
    backgroundColor: '#E9D3F5', // Subtle highlight effect
  },
  occasionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },

  /* CUSTOM OCCASION INPUT */
  customInputContainer: {
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  customInput: {
    backgroundColor: '#fff',
  },
});

export default OccasionSelectScreen;
