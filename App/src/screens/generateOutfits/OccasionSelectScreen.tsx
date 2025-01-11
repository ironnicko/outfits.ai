import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Pressable} from 'react-native';
import {Text, IconButton, TextInput, Icon} from 'react-native-paper';
import SafeScreen from '../../components/SafeScreen';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
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

        <View style={styles.chatHint}>
          <Icon source="diamond-stone" size={24} color="#4A6741" />
          <Text style={styles.chatHintText}>
            Chat with the AI to generate the perfect occasion for you
          </Text>
        </View>

        <ScrollView style={styles.occasionList}>
          {occasions.map((occasion, index) => (
            <Pressable
              key={index}
              style={styles.occasionItem}
              onPress={() => handleSelect(occasion)}>
              <Text style={styles.occasionText}>{occasion}</Text>
            </Pressable>
          ))}
          
          <Pressable
            style={styles.occasionItem}
            onPress={() => setShowCustomInput(true)}>
            <Text style={styles.occasionText}>+ Custom Occasion</Text>
          </Pressable>
        </ScrollView>

        {showCustomInput && (
          <View style={styles.customInputContainer}>
            <TextInput
              mode="outlined"
              label="Enter custom occasion"
              value={customOccasion}
              onChangeText={setCustomOccasion}
              style={styles.customInput}
              right={
                <TextInput.Icon
                  icon="check"
                  onPress={() => {
                    if (customOccasion.trim()) {
                      handleSelect(customOccasion);
                    }
                  }}
                />
              }
            />
          </View>
        )}
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    color: '#4A6741',
    flex: 1,
    textAlign: 'center',
    marginRight: 48,
  },
  chatHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8ECE6',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    gap: 8,
  },
  chatHintText: {
    color: '#4A6741',
    flex: 1,
  },
  occasionList: {
    flex: 1,
    padding: 16,
  },
  occasionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  occasionText: {
    fontSize: 16,
    color: '#000',
  },
  customInputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  customInput: {
    backgroundColor: '#fff',
  },
});

export default OccasionSelectScreen; 