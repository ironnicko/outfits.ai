import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../../../src/components/SafeScreen';
import { useNavigation } from '@react-navigation/native';
import { getUsernameLocal } from '../../../src/utils/auth';
import { useAuthStore } from '../../../src/store/authStore';
import { supabase } from '../../../src/store/supabase';
import { NavigationProp } from '../../../src/types/types';

const SettingItem = ({ icon, title, onPress }: any) => (
  <Pressable style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingContent}>
      <Icon name={icon} size={22} color="#843CA7" />
      <Text style={styles.settingText}>{title}</Text>
    </View>
    <Icon name="chevron-right" size={22} color="#A3A3A3" />
  </Pressable>
);

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const localUsername = await getUsernameLocal();
      const authUsername = useAuthStore.getState().username;
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
              useAuthStore.setState({
                token: null,
                username: null,
                isOnboardingComplete: false,
              });
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
          <Icon name="account" size={24} color="#843CA7" />
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signed in as</Text>
          <Text style={styles.email}>{username}</Text>
        </View>

        <Divider style={styles.divider} />

        <SettingItem
          icon="bell-outline"
          title="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
        <SettingItem
          icon="message-outline"
          title="Support & Feedback"
          onPress={() => navigation.navigate('Support')}
        />
        <SettingItem
          icon="information-outline"
          title="About"
          onPress={() => navigation.navigate('About')}
        />

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={22} color="#B00020" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>Outfits.ai v0.1.0</Text>
      </View>
    </SafeScreen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  title: {
    color: '#843CA7',
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#E2E2E2',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 'auto',
  },
  logoutText: {
    fontSize: 16,
    color: '#B00020',
    fontWeight: '500',
    marginLeft: 12,
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
    padding: 16,
  },
});