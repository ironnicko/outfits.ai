import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../components/SafeScreen';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { api } from '../utils/api';
import { AuthState, useAuthStore } from '../store/authStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const setTokenState = useAuthStore((state: AuthState) => state.setToken);
  const setUsernameState = useAuthStore((state: AuthState) => state.setUsername);

  const handleSignIn = async () => {
    try {
      console.log(email, password)
      var res: any = await api.post('/api/v1/user/login', {
        email,
        password,
      });

      setTokenState(res.data.token);
      const username = (await api.get('/api/v1/user/user-info', {
        headers:{
          Authorization: `Bearer ${res.data.token}`
        }
      })).data;
      setUsernameState(username.result.username);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (err: any) {
      console.error(err);
      // Handle errors (e.g., show a message to the user)
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    try {

      console.log(`Signing in with ${provider}`);
      const res = await api.post(`/api/v1/user/login/${provider}`, {
        email,
        password,
      });

      setTokenState(res.data.token);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (err: any) {
      console.error(err);
      // Handle errors (e.g., show a message to the user)
    }
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text variant="displaySmall" style={styles.title}>
          Sign In
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            outlineColor="#4A6741"
            activeOutlineColor="#4A6741"
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            mode="outlined"
            style={styles.input}
            outlineColor="#4A6741"
            activeOutlineColor="#4A6741"
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
          />
          <Button
            mode="contained"
            style={styles.signInButton}
            onPress={handleSignIn}>
            Sign In
          </Button>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtons}>
          <Pressable
            style={[styles.socialButton, styles.googleButton]}
            onPress={() => handleSocialSignIn('google')}>
            <Icon name="google" size={24} color="#000" />
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
          </Pressable>

          <Pressable
            style={[styles.socialButton, styles.appleButton]}
            onPress={() => handleSocialSignIn('apple')}>
            <Icon name="apple" size={24} color="#000" />
            <Text style={styles.socialButtonText}>Sign in with Apple</Text>
          </Pressable>
        </View>

        <Text style={styles.termsText}>
          By signing in to Outfits.AI, you agree to our{' '}
          <Text style={styles.link}>Terms</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
  },
  signInButton: {
    backgroundColor: '#4A6741',
    paddingVertical: 8,
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 16,
    color: '#666',
  },
  socialButtons: {
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  googleButton: {
    backgroundColor: '#fff',
  },
  appleButton: {
    backgroundColor: '#fff',
  },
  socialButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  termsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 'auto',
    marginBottom: 16,
  },
  link: {
    color: '#4A6741',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 