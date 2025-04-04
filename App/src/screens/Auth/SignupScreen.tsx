import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SafeScreen from '../../components/SafeScreen';
import { api } from '../../utils/api';
import { NavigationProp } from '../../types/types';
import { supabase } from '../../store/supabase';
import { useAuthStore } from "../../store/authStore"; 
import { useNavigation } from '@react-navigation/native';


const SignupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    setError("");
    setLoading(true);

    try {
        const { data: { user, session }, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } },
        });

        if (error) {
            Alert.alert(error.message);
            throw error;
        }

        if (!session) {
            Alert.alert("Please check your inbox for email verification!");
            return;
        }

        // ✅ Store user in DB
        await api.post("/api/v1/user", { 
            id: user?.id, 
            username, 
            email, 
            password,
            isonboardingcompleted: false // ✅ Ensure onboarding is false by default
        });

        // ✅ Store token in Zustand
        await useAuthStore.getState().setToken(session.access_token);

        // ✅ Fetch user data
        const response = await api.get(`/api/v1/user`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (response.data?.result) {
            const userData = response.data.result;
            useAuthStore.setState({
                username: userData.username,
                isOnboardingComplete: userData.isonboardingcompleted,
            });

        }
        console.log('onboarding', useAuthStore.getState().isOnboardingComplete);

    } catch (err) {
        setError(err.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
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
          <Pressable style={[styles.socialButton, styles.googleButton]}>
            <Icon name="google" size={24} color="#000" />
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
          </Pressable>

          <Pressable style={[styles.socialButton, styles.appleButton]}>
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
    backgroundColor: '#FAFAFA', // Updated background color
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#843CA7', // Accent color
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: '#843CA7', // Accent color
    paddingVertical: 12,
    borderRadius: 32, // Large rounded button
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
    fontWeight: '600',
  },
  socialButtons: {
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 32, // Large rounded buttons
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
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
    marginBottom: 16,
    fontSize: 14,
  },
  link: {
    color: '#843CA7', // Updated accent color
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default SignupScreen;
