import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Pressable, RefreshControl, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import SafeScreen from '../components/SafeScreen';
import OutfitPreview from '../components/OutfitPreview';
import { useNavigation } from '@react-navigation/native';
import { SavedOutfit, useOutfitStore } from "../store/outfitStore"
import { AuthState, useAuthStore } from '../store/authStore';
import { api } from '../utils/api';
import { LoadingScreen } from '../components/LoadingScreen';
import { NavigationProp } from '../types/types';

const MyLooksScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [token, setToken] = useState(useAuthStore((state: AuthState) => state.token));
  const outfits = useOutfitStore((state) => state.outfits)
  const setOutfits = useOutfitStore((state) => state.fetch)
  const fetchOutfits = async () => {
    await setOutfits(token|| "")
    setLoading(false)
  };

  const handleDeleteItem = (item: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item from your looks?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setLoading(true);
              await api.delete(`/api/v1/outfit/${item}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setRefresh(!refresh);
            } catch (error) {
              console.error('Delete error:', error);
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };
  
  
  useEffect(() => {
    fetchOutfits()
  }, [refresh])
  const renderOutfit = (item : SavedOutfit) => (
    
    <Pressable 
      style={styles.outfitCard}
      onLongPress={() =>{handleDeleteItem(item.ID || "")}}
      onPress={() => navigation.navigate('OutfitPreviewScreen', {
        outfits: [item],
        occasion: item.occasion,
        saveToLooks: false,
      })}>
      <OutfitPreview items={item} occasion={item.occasion} />
      <Text style={styles.occasionText}>{item.occasion || 'No occasion'}</Text>
      <Text style={styles.dateText}>
        {new Date(item.CreatedAt || "").toLocaleDateString()}
      </Text>
    </Pressable>
  );

  return (
    <SafeScreen>
      {loading? <LoadingScreen /> : (
        <>
        <View 
         style={styles.container}>
        <Text style={styles.title}>My Looks</Text>
        {(outfits || []).length === 0 ? (
          <View style={styles.emptyState}>
            <Text>No saved outfits yet</Text>
          </View>
        ) : 
          <FlatList
            data={outfits}
            renderItem={({item} ) => renderOutfit(item)}
            keyExtractor={item => item.ID || ""}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {
              setRefresh(!refresh)
            }} />}
            />}
            </View>
          </>
          )
        }
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    padding: 16,
    color: '#4A6741',
  },
  outfitCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  occasionText: {
    fontSize: 16,
    color: '#4A6741',
    padding: 16,
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingVertical: 8,
  },
});

export default MyLooksScreen; 