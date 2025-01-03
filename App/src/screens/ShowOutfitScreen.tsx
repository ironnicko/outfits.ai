import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OutfitPreview from '../components/OutfitPreview';
import SafeScreen from '../components/SafeScreen';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';


type RouteProps = RouteProp<RootStackParamList, 'OutfitPreview'>;

const ShowOutfitScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>()
  const { selectedItems } = route.params;

  const handleSaveToLooks = () => {
    // TODO: Implement save to looks functionality
    console.log('Saving to looks...');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting...');
  };

  return (
    <SafeScreen>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <IconButton
          icon="information"
          size={24}
          onPress={() => console.log('Show info')}
        />
      </View>

      {/* Outfit Preview */}
      <View style={styles.previewContainer}>
        <OutfitPreview items={selectedItems} />
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <Pressable style={styles.saveButton} onPress={handleSaveToLooks}>
          <Icon name="dots-horizontal" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save to Looks</Text>
        </Pressable>
        <Pressable style={styles.exportButton} onPress={handleExport}>
          <Text style={styles.exportButtonText}>Export</Text>
          <Icon name="export-variant" size={20} color="#000" />
        </Pressable>
      </View>
    </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  ratingButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A6741',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShowOutfitScreen; 