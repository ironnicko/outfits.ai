import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import SafeScreen from '../components/SafeScreen';
import { api } from '../utils/api';
import { NavigationProp } from '../types/types';
import { supabase } from '../store/supabase';

const SignupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError("")
    setLoading(true)
    
    try {
      const {data: {user, session}, error} = await supabase.auth.signUp({
        email: email,
        password: password,
        options:{
          data:{
            username
          }
        }
      })
      await api.post('/api/v1/user', {
        id : user?.id,
        username,
        email,
        password,
      });


      if (error) {
        Alert.alert(error.message)
        throw error
      }
      if (!session) Alert.alert('Please check your inbox for email verification!')

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally{
      setLoading(false)
    }
  };

  const handleSocialSignIn = (provider: string) => {
    // Implement social sign-in logic
    console.log(`${provider} sign-in`);
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          mode="outlined"
          label="Username"
          value={username}
          onChangeText={setUsername}
          disabled={loading}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          disabled={loading}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          autoCapitalize="none"
          onChangeText={setPassword}
          disabled={loading}
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          disabled={loading}
          secureTextEntry={!showConfirmPassword}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          style={styles.input}
        />

        <Pressable style={styles.signupButton} disabled={loading} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </Pressable>

        <Text style={styles.orText}>or</Text>

        <View style={styles.socialButtons}>
          <Pressable
            style={[styles.socialButton, styles.googleButton]}
            onPress={() => handleSocialSignIn('google')}>
            <Icon name="google" size={24} color="#000" />
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
          </Pressable>

          <Pressable
            style={[styles.socialButton, styles.appleButton]}
            onPress={() => handleSocialSignIn('apple')}>
            <Icon name="apple" size={24} color="#000" />
            <Text style={styles.socialButtonText}>Sign up with Apple</Text>
          </Pressable>
        </View>

        <Text style={styles.termsText}>
          By signing up to Outfits.AI, you agree to our{' '}
          <Text style={styles.link}>Terms</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.link}>Log in</Text>
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: '#4A6741',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
  socialButtons: {
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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
  },
  termsText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  link: {
    color: '#4A6741',
    textDecorationLine: 'underline',
  },
  switchText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default SignupScreen; 