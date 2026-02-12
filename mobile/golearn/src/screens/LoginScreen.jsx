import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gamepad2 } from 'lucide-react-native';
import { GameCard, GameInput, GameButton, colors } from '../components/GameUI';
import API from '../services/api';
import { useAlertStore } from '../store/useStore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = useAlertStore((state) => state.showAlert)

  const handleLogin = async () => {
    if (!email || !password) return showAlert({ 
        title: "Error", 
        message: "Lengkapi semua data!", 
        type: "error" 
      })
    
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, ...userData } = res.data.data;
      
      await AsyncStorage.setItem('user_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      
      showAlert({ 
        title: "Sukses", 
        message: "Login Berhasil!", 
        type: "success" ,
        buttonText: "Mulai Petualangan",
        onConfirm: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }], 
          });
        }
      })
    } catch (err) {
      showAlert({ 
        title: "Upss.. Login Gagal", 
        message: err.response?.data?.message || 'Login gagal.', 
        type: "error",
        buttonText: "ULANGI"
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.circle, { top: -50, left: -50, backgroundColor: colors.secondary }]} />
      <View style={[styles.circle, { bottom: -50, right: -50, backgroundColor: colors.sand }]} />

      <View style={styles.content}>
        <GameCard>
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Gamepad2 size={32} color={colors.white} />
            </View>
            <Text style={styles.title}>GoLearn</Text>
            <Text style={styles.subtitle}>Ready to play & learn?</Text>
          </View>

          <GameInput 
            label="Email" 
            placeholder="player@golearn.id"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <GameInput 
            label="Password" 
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <GameButton 
            style={{ marginTop: 16 }} 
            onPress={handleLogin}
          >
            {loading ? 'LOADING...' : 'START GAME'}
          </GameButton>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Daftar disini</Text>
            </TouchableOpacity>
          </View>
        </GameCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  circle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.dark,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 32,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#6B7280',
  },
  footerLink: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: colors.primary,
    textDecorationLine: 'underline',
  }
});