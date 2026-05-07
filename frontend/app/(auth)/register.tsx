import React, { useState, useRef } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { Link, useRouter } from 'expo-router';
import { useStore } from '@/store/store';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const router = useRouter();

  async function signUpWithEmail() {
    setLoading(true);
    
    // Ensure username is not an email
    if (username.includes('@')) {
      useStore.getState().showAlert('Invalid Username', 'Username cannot contain an @ symbol.');
      setLoading(false);
      return;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username.trim(),
        }
      }
    });

    if (error) useStore.getState().showAlert('Registration Failed', error.message);
    else if (!session) useStore.getState().showAlert('Success', 'Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <View className="mb-10 items-center">
          <Text variant="title1" className="text-foreground text-4xl font-bold mb-2">Create Account</Text>
          <Text variant="body" className="text-muted-foreground text-center">
            Sign up to sync your reading settings
          </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium mb-1 text-foreground">Username</Text>
            <TextInput
              onChangeText={(text) => setUsername(text)}
              value={username}
              placeholder="Username"
              autoCapitalize="none"
              className="h-12 border border-border rounded-lg px-4 bg-card text-foreground"
              placeholderTextColor="#888"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View>
            <Text className="text-sm font-medium mb-1 text-foreground">Email</Text>
            <TextInput
              ref={emailRef}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className="h-12 border border-border rounded-lg px-4 bg-card text-foreground"
              placeholderTextColor="#888"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="submit"
            />
          </View>
          <View>
            <Text className="text-sm font-medium mb-1 text-foreground">Password</Text>
            <TextInput
              ref={passwordRef}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize="none"
              className="h-12 border border-border rounded-lg px-4 bg-card text-foreground"
              placeholderTextColor="#888"
              returnKeyType="done"
              onSubmitEditing={() => signUpWithEmail()}
            />
          </View>

          <Button 
            onPress={() => signUpWithEmail()} 
            disabled={loading}
            className="mt-4"
            size="lg"
          >
            <Text className="text-primary-foreground font-bold">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </Button>

          <View className="flex-row justify-center mt-4">
            <Text className="text-muted-foreground">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-bold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}