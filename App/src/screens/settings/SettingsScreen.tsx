import React from 'react';
import {StyleSheet, View, Pressable, Alert} from 'react-native';
import {Text, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../../components/SafeScreen';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';
import { clearTokenLocal, clearUsernameLocal, getTokenLocal, getUsernameLocal } from '../../utils/auth';
import { AuthState, useAuthStore } from '../../store/authStore';
import { api } from '../../utils/api';
import { useClothingStore } from '../../store/clothingStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingItem = ({icon, title, onPress} : any) => (
  <Pressable style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingContent}>
      <Icon name={icon} size={24} color="#4A6741" />
      <Text variant="titleMedium" style={styles.settingText}>
        {title}
      </Text>
    </View>
    <Icon name="chevron-right" size={24} color="#666" />
  </Pressable>
);

const SettingsScreen =  () => {
  const navigation = useNavigation<NavigationProp>();
  const clearToken = useAuthStore((state: AuthState) => state.clearToken);
  const clearUsername = useAuthStore((state: AuthState) => state.clearUsername);
  const clearClothes = useClothingStore((state) => state.clear);
  const token = useAuthStore((state: AuthState) => state.token) || getTokenLocal();
  const username = useAuthStore((state: AuthState) => state.username) || getUsernameLocal();
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: () => {
            clearUsernameLocal();
            clearUsername();
            clearTokenLocal();
            clearToken();
            clearClothes();
            api.post(
          '/api/v1/user/logout',
              {token : token},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
        
                },
              }
            );
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="account" size={24} color="#4A6741" />
          <Text variant="headlineMedium" style={styles.title}>
            Settings
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Signed in as
          </Text>
          <Text variant="headlineSmall" style={styles.email}>
            { username }
          </Text>
        </View>

        <Divider style={styles.divider} />

        <SettingItem
          icon="bell-outline"
          title="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
        <SettingItem
          icon="school"
          title="Outfits.AI Tutorials"
          onPress={() => navigation.navigate('Tutorials')}
        />
        <SettingItem
          icon="message-text-outline"
          title="Support & Feedback"
          onPress={() => navigation.navigate('Support')}
        />
        <SettingItem
          icon="information"
          title="About"
          onPress={() => navigation.navigate('About')}
        />

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}>
          <Icon name="logout" size={24} color="#666" />
          <Text variant="titleMedium" style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>

        <Text style={styles.version}>Outfits.AI 0.1.0</Text>
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
    padding: 16,
    gap: 8,
  },
  title: {
    color: '#4A6741',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: '#666',
    marginBottom: 8,
  },
  email: {
    color: '#000',
    fontWeight: '600',
  },
  divider: {
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    color: '#4A6741',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    marginTop: 'auto',
  },
  logoutText: {
    color: '#666',
  },
  version: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
    fontSize: 14,
  },
});

export default SettingsScreen; 