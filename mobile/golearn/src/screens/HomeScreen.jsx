import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, 
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Search, Grid, List, Play, Trophy, CheckCircle } from 'lucide-react-native';

import API from '../services/api';
import { colors, GameCard, GameInput, GameButton, XPBar, GameIconButton } from '../components/GameUI';
import {useAlertStore} from '../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const showAlert = useAlertStore((state) => state.showAlert);

  
  useFocusEffect(
    useCallback(() => {
      loadUserData();
      fetchSubjects();
    }, [])
  );

  
  useEffect(() => {
    fetchSubjects();
  }, [search]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) { console.error(e); }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      
      const res = await API.get(`/subjects?keyword=${search}`);
      setSubjects(res.data.data);
    } catch (err) {
      
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubjects();
    loadUserData(); 
  };

  
  const renderItem = ({ item }) => {
    const isGrid = viewMode === 'grid';
    const isCompleted = item.progress === 100;
    
    
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        
        const cleanPath = path.replace(/\\/g, '/');
        
        return `${API.defaults.baseURL.replace('/api', '')}/${cleanPath}`;
    };

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('SubjectDetail', { id: item._id })}
        style={[styles.itemContainer, isGrid ? { flex: 0.5 } : { flex: 1 }]}
      >
        <GameCard style={[styles.cardOverride, isCompleted && { borderColor: '#059669' }]}>
          
          <View style={styles.thumbnailContainer}>
            {item.thumbnail ? (
               <Image 
                 source={{ uri: getImageUrl(item.thumbnail) }} 
                 style={styles.thumbnail}
                 resizeMode="cover"
               />
            ) : (
               <View style={styles.thumbnailPlaceholder}>
                 <Text style={styles.placeholderText}>{item.title.charAt(0)}</Text>
               </View>
            )}
            
            {isCompleted && (
                <View style={styles.completedOverlay}>
                    <CheckCircle size={32} color="#10B981" fill="#ECFDF5" />
                    <Text style={styles.completedText}>SELESAI</Text>
                </View>
            )}

            {!isCompleted && (
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>Kelas {item.grade || 12}</Text>
                </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.subjectTitle} numberOfLines={2}>{item.title}</Text>
            
            <View style={{ marginVertical: 8 }}>
                <XPBar 
                    progress={item.progress || 0} 
                    color={isCompleted ? "#10B981" : colors.primary} 
                    height={12} 
                    showLabel={!isGrid} 
                />
            </View>

            <GameButton 
                variant={isCompleted ? "secondary" : "primary"} 
                style={[{ paddingVertical: 8, marginTop: 'auto', borderBottomWidth: 4 }, isCompleted && { backgroundColor: colors.secondary }]}
                onPress={() => navigation.navigate('SubjectDetail', { id: item._id })}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {isCompleted ? (
                        !isGrid ? <CheckCircle size={16} color="white" /> : 
                        <Text style={{ color: 'white', fontFamily: 'PlusJakartaSans-Bold' }}>
                            REVIEW
                        </Text>
                    ) : (
                        <Play size={16} color="white" fill="white" />
                    )}
                    
                    {!isGrid && (
                        <Text style={{ color: 'white', fontFamily: 'PlusJakartaSans-Bold' }}>
                            {isCompleted ? "REVIEW" : "MAIN"}
                        </Text>
                    )}
                </View>
            </GameButton>
          </View>
        </GameCard>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <View>
                <Text style={styles.welcomeText}>Halo, Player!</Text>
                <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            </View>
            <View style={styles.xpContainer}>
                <Trophy size={20} color="#CA8A04" fill="#FACC15" />
                <Text style={styles.xpText}>{user?.xp || 0} XP</Text>
            </View>
        </View>

        <View style={styles.searchPanel}>
            <View style={[styles.rivet, { top: 8, left: 8 }]} />
            <View style={[styles.rivet, { top: 8, right: 8 }]} />
            <View style={[styles.rivet, { bottom: 8, left: 8 }]} />
            <View style={[styles.rivet, { bottom: 8, right: 8 }]} />

            <Text style={styles.searchLabel}>CARI MISI</Text>

            <View style={styles.controls}>
                <View style={{ flex: 1, marginRight: 12 }}>
                    <GameInput 
                        placeholder="Ketik nama pelajaran..." 
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInputOverride} 
                    />
                </View>
                <GameIconButton 
                    active={viewMode === 'grid'} 
                    onPress={() => setViewMode('grid')}
                    style={{ marginRight: 8 }}
                >
                    <Grid size={24} color={viewMode === 'grid' ? 'white' : colors.secondary} />
                </GameIconButton>
                <GameIconButton 
                    active={viewMode === 'list'} 
                    onPress={() => setViewMode('list')}
                >
                    <List size={24} color={viewMode === 'list' ? 'white' : colors.secondary} />
                </GameIconButton>
            </View>
          </View>

        { 
          loading ? 
          <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Memuat Peta...</Text>
            </View>
          : <FlatList
            data={subjects}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            key={viewMode} 
            numColumns={viewMode === 'grid' ? 2 : 1}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
            ListEmptyComponent={
                !loading && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Belum ada quest tersedia.</Text>
                    </View>
                )
            }
        />
        }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 18,
    color: colors.primary,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 24,
  },
  welcomeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#9CA3AF',
  },
  userName: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 24,
    color: colors.dark,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EAB308',
    gap: 6,
  },
  xpText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: '#854D0E', 
  },
  searchPanel: {
    backgroundColor: colors.secondary, 
    borderRadius: 20,
    borderWidth: 4,
    borderColor: colors.dark,
    padding: 20,
    marginBottom: 24,
    position: 'relative',
    
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  searchLabel: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 12,
    color: colors.white,
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  rivet: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  
  
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  searchInputOverride: {
    marginBottom: 0, 
    backgroundColor: colors.white, 
    borderRadius: 8,
    fontFamily: 'PlusJakartaSans-Semibold',
    borderColor: colors.dark,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  
  itemContainer: {
    padding: 6,
    marginBottom: 12, 
  },
  cardOverride: {
    padding: 0, 
    overflow: 'hidden',
    borderWidth: 3,
    backgroundColor: colors.cream,
    
    
    minHeight: 250, 
    width: '100%',
  },
  thumbnailContainer: {
    height: 120, 
    backgroundColor: colors.sand,
    borderBottomWidth: 3,
    borderBottomColor: colors.dark,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },
  placeholderText: {
    fontSize: 40,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: 'rgba(255,255,255,0.5)',
  },
  completedOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(6, 78, 59, 0.7)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  completedText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: '#D1FAE5', 
    fontSize: 16,
    marginTop: 4,
    letterSpacing: 2,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.dark,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    color: colors.dark,
  },
  cardContent: {
    padding: 12,
    gap: 8, 
  },
  subjectTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16, 
    color: colors.dark,
    marginBottom: 4,
    
    
    minHeight: 40, 
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#9CA3AF',
  },
});