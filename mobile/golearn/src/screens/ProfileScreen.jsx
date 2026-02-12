import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { User, Settings, LogOut, Heart, Edit, Shield, Star, Bookmark } from 'lucide-react-native';

import { colors, GameCard, GameButton } from '../components/GameUI';
import {useAlertStore} from '../store/useStore';
import API from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const showAlert = useAlertStore((state) => state.showAlert);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    showAlert({
      title: "Log Out?",
      message: "Progress petualanganmu sudah tersimpan aman.",
      type: "info", 
      buttonText: "KELUAR GAME",
      onConfirm: async () => {
        try {
            await AsyncStorage.removeItem('user_token');
            await AsyncStorage.removeItem('user_data');
            
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (e) {
            console.log(e);
        }
      }
    });
  };

  
  const getRankTitle = (xp = 0) => {
    if (xp < 100) return "Novice Explorer";
    if (xp < 500) return "Apprentice";
    if (xp < 1000) return "Scholar";
    if (xp < 2000) return "Expert";
    return "Grandmaster";
  };

  
  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API.defaults.baseURL.replace('/api', '')}/${path.replace(/\\/g, '/')}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
            <Text style={styles.headerTitle}> MY PROFILE</Text>
        </View>

        <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
                <View style={styles.avatarContainer}>
                    {user?.avatar ? (
                        <Image source={{ uri: getAvatarUrl(user.avatar) }} style={styles.avatarImage} />
                    ) : (
                        <Text style={styles.avatarInitial}>{user?.name?.charAt(0).toUpperCase()}</Text>
                    )}
                </View>
                <View style={styles.levelBadge}>
                    <Star size={12} color={colors.white} fill={colors.white} />
                    <Text style={styles.levelText}>{Math.floor((user?.xp || 0) / 100) + 1}</Text>
                </View>
            </View>

            <View style={{ alignItems: 'center', marginTop: 12 }}>
                <Text style={styles.userName}>{user?.name || "Player"}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                
                <View style={styles.titleBadge}>
                    <Shield size={14} color="#854D0E" fill="#FACC15" />
                    <Text style={styles.titleText}>{getRankTitle(user?.xp)}</Text>
                </View>
            </View>
        </View>

        <View style={styles.statsRow}>
            <GameCard style={[styles.statCard, { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' }]}>
                <Text style={[styles.statValue, { color: '#1E40AF' }]}>{user?.xp || 0}</Text>
                <Text style={[styles.statLabel, { color: '#1E40AF' }]}>TOTAL XP</Text>
            </GameCard>
            
            <GameCard style={[styles.statCard, { backgroundColor: '#ECFDF5', borderColor: '#10B981' }]}>
                <Text style={[styles.statValue, { color: '#065F46' }]}>Active</Text>
                <Text style={[styles.statLabel, { color: '#065F46' }]}>STATUS</Text>
            </GameCard>
        </View>

        <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Bookmark')}>
                <View style={[styles.menuIcon, { backgroundColor: '#F59E0B' }]}>
                    <Bookmark size={20} color={colors.white} />
                </View>
                <Text style={styles.menuText}>My Inventory (Bookmarks)</Text>
            </TouchableOpacity>
        </View>

        <GameButton 
            onPress={handleLogout} 
            style={styles.logoutButton}
            variant="primary" 
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <LogOut size={20} color={colors.white} />
                <Text style={{ color: colors.white, fontFamily: 'PlusJakartaSans-Bold' }}>LOGOUT</Text>
            </View>
        </GameButton>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120, 
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.sand,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16,
    letterSpacing: 2,
    color: colors.dark,
  },
  
  
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.sand,
    borderWidth: 4,
    borderColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 40,
    color: colors.dark,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    elevation: 4,
  },
  levelText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: colors.white,
    fontSize: 12,
  },
  userName: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 24,
    color: colors.dark,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF9C3', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EAB308', 
  },
  titleText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 12,
    color: '#854D0E', 
    textTransform: 'uppercase',
  },

  
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 16,
  },
  statValue: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    letterSpacing: 1,
  },

  
  menuContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.sand,
    
    elevation: 2,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: colors.dark,
  },

  
  logoutButton: {
    marginHorizontal: 20,
    backgroundColor: '#EF4444', 
    borderColor: '#B91C1C', 
  },
  versionText: {
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 20,
  }
});