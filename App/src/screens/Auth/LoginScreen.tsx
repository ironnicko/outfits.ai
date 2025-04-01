import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../../components/SafeScreen';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../utils/api';
import { AuthState, useAuthStore } from '../../store/authStore';
import { supabase } from '../../store/supabase';
import { NavigationProp } from '../../types/types';
import { CommonActions } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const setTokenState = useAuthStore((state: AuthState) => state.setToken);

  const handleSignIn = async () => {
    setLoading(true);
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login error:", error);
            return;
        }

        if (data.session) {
            const token = data.session.access_token;
          
            // ✅ Fetch user data & onboarding status
            const response = await api.get(`/api/v1/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.result) {
                const userData = response.data.result;
                useAuthStore.setState({
                    username: userData.username,
                    isOnboardingComplete: userData.is_on_boarding_completed,
                });

            } else {
                console.error("User data is missing from response:", response.data);
            }
            console.log('onboarding', response.data.result.is_on_boarding_completed);
            
            await useAuthStore.getState().setToken(token);
        }
    } catch (err) {
        console.error("Sign in error:", err);
    } finally {
        setLoading(false);
    }
};

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
            disabled={loading}
            mode="outlined"
            style={styles.input}
            outlineColor="#843CA7"
            activeOutlineColor="#843CA7"
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            disabled={loading}
            secureTextEntry={secureTextEntry}
            mode="outlined"
            style={styles.input}
            outlineColor="#843CA7"
            activeOutlineColor="#843CA7"
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
          />
          
          {/* Entire button is pressable now */}
          <Pressable style={styles.signInButton} disabled={loading} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtons}>
          <Pressable
            style={[styles.socialButton, styles.googleButton]}
            onPress={() => handleSocialSignIn('google')}
          >
            <Icon name="google" size={24} color="#000" />
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
          </Pressable>

          <Pressable
            style={[styles.socialButton, styles.appleButton]}
            onPress={() => handleSocialSignIn('apple')}
          >
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
    backgroundColor: '#FAFAFA', // Updated background color
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#843CA7', // Accent color
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
  },
  signInButton: {
    backgroundColor: '#843CA7', // Updated accent color
    paddingVertical: 12,
    borderRadius: 32, // Large rounded button
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
    width: '100%', // Make sure the entire button area is pressable
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#D3D3D3',
  },
  orText: {
    marginHorizontal: 16,
    color: '#666',
    fontWeight: '600',
  },
  socialButtons: {
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 32, // Large rounded buttons
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
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
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 'auto',
    marginBottom: 16,
    fontSize: 14,
  },
  link: {
    color: '#843CA7', // Updated accent color
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

export default LoginScreen;
