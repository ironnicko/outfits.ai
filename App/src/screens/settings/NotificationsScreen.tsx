import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Switch} from 'react-native-paper';
import SafeScreen from '../../components/SafeScreen';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState({
    outfitSuggestions: true,
    newFeatures: true,
    weeklyRecap: false,
  });

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          Notifications
        </Text>
        
        <View style={styles.option}>
          <View>
            <Text variant="titleMedium">Outfit Suggestions</Text>
            <Text variant="bodyMedium" style={styles.description}>
              Get daily outfit recommendations
            </Text>
          </View>
          <Switch
            value={notifications.outfitSuggestions}
            onValueChange={value =>
              setNotifications(prev => ({...prev, outfitSuggestions: value}))
            }
          />
        </View>
        
        {/* Add more notification options */}
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    color: '#4A6741',
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  description: {
    color: '#666',
    marginTop: 4,
  },
});

export default NotificationsScreen; 