import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, RefreshControl, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Trophy, Crown, Medal, Award, User } from 'lucide-react-native';

import API from '../services/api';
import { colors, GameCard } from '../components/GameUI';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) setCurrentUser(JSON.parse(userData));

      
      const res = await API.get('/interactions/leaderboard');
      setLeaders(res.data.data);
    } catch (err) {
      console.log('Leaderboard error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  
  const getRankStyle = (index) => {
    switch (index) {
      case 0: 
        return {
          bg: '#FEF9C3', 
          border: '#EAB308', 
          text: '#854D0E', 
          icon: <Crown size={32} color="#CA8A04" fill="#FACC15" />,
          scale: 1.05 
        };
      case 1: 
        return {
          bg: '#F3F4F6', 
          border: '#9CA3AF', 
          text: '#374151', 
          icon: <Medal size={28} color="#6B7280" fill="#E5E7EB" />,
          scale: 1
        };
      case 2: 
        return {
          bg: '#FFEDD5', 
          border: '#F97316', 
          text: '#9A3412', 
          icon: <Award size={28} color="#EA580C" fill="#FED7AA" />,
          scale: 1
        };
      default: 
        return {
          bg: colors.white,
          border: colors.sand,
          text: colors.dark,
          icon: <Text style={styles.rankNumber}>{index + 1}</Text>,
          scale: 1
        };
    }
  };

  const renderItem = ({ item, index }) => {
    const rankStyle = getRankStyle(index);
    const isMe = currentUser?._id === item._id;

    
    const getAvatarUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API.defaults.baseURL.replace('/api', '')}/${path.replace(/\\/g, '/')}`;
    };

    return (
      <View style={[styles.itemWrapper, { transform: [{ scale: rankStyle.scale }] }]}>
        <GameCard 
            style={[
                styles.cardOverride, 
                { backgroundColor: rankStyle.bg, borderColor: rankStyle.border },
                isMe && styles.myCardHighlight
            ]}
        >
            <View style={[styles.rankBadge, { borderColor: rankStyle.border }]}>
                {rankStyle.icon}
            </View>

            <View style={styles.userInfo}>
                <View style={[styles.avatarContainer, { borderColor: rankStyle.border }]}>
                    {item.avatar ? (
                        <Image source={{ uri: getAvatarUrl(item.avatar) }} style={styles.avatarImage} />
                    ) : (
                        <Text style={[styles.avatarInitial, { color: rankStyle.text }]}>
                            {item.name?.charAt(0).toUpperCase()}
                        </Text>
                    )}
                </View>
                
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.userName, { color: rankStyle.text }]}>
                            {item.name}
                        </Text>
                        {isMe && (
                            <View style={styles.meBadge}>
                                <Text style={styles.meText}>YOU</Text>
                            </View>
                        )}
                    </View>
                    <Text style={[styles.rankLabel, { color: rankStyle.text }]}>
                        {index === 0 ? 'CHAMPION' : `PERINGKAT ${index + 1}`}
                    </Text>
                </View>
            </View>

            <View style={styles.xpContainer}>
                <Text style={[styles.xpValue, { color: rankStyle.text }]}>{item.xp || 0}</Text>
                <Text style={[styles.xpLabel, { color: rankStyle.text }]}>XP</Text>
            </View>

        </GameCard>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ffffff' }]}>
      
      <View style={styles.bgCircle} />
      
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.trophyWrapper}>
                <Trophy size={40} color="#CA8A04" fill="#FACC15" />
            </View>
            <Text style={styles.headerTitle}>HALL OF FAME</Text>
            <Text style={styles.headerSubtitle}>Top 5 Pelajar Legendaris</Text>
        </View>

        {loading && !refreshing ? (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.white} />
            </View>
        ) : (
            <FlatList
                data={leaders}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.white} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyText}>Belum ada data peringkat.</Text>
                    </View>
                }
            />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  trophyWrapper: {
    width: 80,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.dark,
    marginBottom: 16,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 8,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 32,
    color: colors.primary,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: colors.secondary,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 10,
  },
  itemWrapper: {
    marginBottom: 16,
  },
  cardOverride: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 3,
    
    
    elevation: 4, 
  },
  myCardHighlight: {
    borderWidth: 4,
    borderColor: colors.dark,
    
  },
  
  
  rankBadge: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 2,
    marginRight: 16,
  },
  rankNumber: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 20,
    color: colors.dark,
  },

  
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.sand,
    borderWidth: 2,
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
    fontSize: 18,
  },
  userName: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 14,
  },
  rankLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    opacity: 0.7,
  },
  meBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  meText: {
    color: colors.white,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 8,
  },

  
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 18,
  },
  xpLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    opacity: 0.7,
  },
  
  emptyCard: {
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: colors.secondary,
  }
});