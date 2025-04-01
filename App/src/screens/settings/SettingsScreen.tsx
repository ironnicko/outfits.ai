import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Pressable, Alert} from 'react-native';
import {Text, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../../../src/components/SafeScreen';
import {useNavigation} from '@react-navigation/native';
import {  getUsernameLocal } from '../../../src/utils/auth';
import {  useAuthStore } from '../../../src/store/authStore';

import { supabase } from '../../../src/store/supabase';
import { NavigationProp } from '../../../src/types/types';

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
  

  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const localUsername = await getUsernameLocal();
      setUsername(localUsername || " ");
      const authUsername =  useAuthStore((state) => state.username);
      setUsername(authUsername || localUsername || " ");

    };
    fetchUsername();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
  
              // ✅ Update Zustand store
              useAuthStore.setState({
                token: null,
                username: null,
                isOnboardingComplete: false,
              });
  
              // ✅ Navigate to the splash/login screen
              // navigation.reset({
              //   index: 0,
              //   routes: [{ name: 'WelcomeScreen' }],
              // });
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
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
            { username  }
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