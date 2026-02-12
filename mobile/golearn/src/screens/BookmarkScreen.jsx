import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Trash2, PlayCircle, BookOpen, ExternalLink, Backpack } from 'lucide-react-native';

import API from '../services/api';
import { colors, GameCard, GameButton } from '../components/GameUI';
import {useAlertStore} from '../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookmarkScreen({ navigation }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const showAlert = useAlertStore((state) => state.showAlert);

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [])
  );

  const fetchBookmarks = async () => {
    try {
      const res = await API.get('/interactions/bookmark');
      setBookmarks(res.data.data);
    } catch (err) {
      console.log('Error fetch bookmarks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookmarks();
  };

  const handleRemove = async (materialId) => {
    try {
      
      setBookmarks(prev => prev.filter(b => b.material?._id !== materialId));
      
      
      await API.post('/interactions/bookmark', { materialId });
      
    } catch (err) {
      showAlert({ title: "Gagal", message: "Gagal menghapus bookmark.", type: "error" });
      fetchBookmarks(); 
    }
  };

  const handlePressItem = (item) => {
    if (!item.material) return;
    
    
    
    navigation.navigate('MaterialView', {
        id: item.material._id,
        chapterId: item.chapter?._id, 
        materialData: item.material,
        subjectData: null 
    });
  };

  const renderItem = ({ item }) => {
    
    if (!item.material) return null; 
    
    const mat = item.material;

    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => handlePressItem(item)}
        style={styles.itemWrapper}
      >
        <GameCard style={styles.cardOverride}>
            <View style={[
                styles.iconBox, 
                mat.type === 'video' ? { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' } : { backgroundColor: '#ECFDF5', borderColor: '#10B981' }
            ]}>
                {mat.type === 'video' ? (
                    <PlayCircle size={24} color="#1E40AF" />
                ) : (
                    <BookOpen size={24} color="#065F46" />
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>{mat.title}</Text>
                <View style={styles.metaRow}>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{mat.type}</Text>
                    </View>
                    {item.chapter && (
                        <Text style={styles.chapterText} numberOfLines={1}>
                            • {item.chapter.title}
                        </Text>
                    )}
                </View>
            </View>

            <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleRemove(mat._id)}
            >
                <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
        </GameCard>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>INVENTORY</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Membuka Tas...</Text>
        </View>
      ) : (
        <FlatList
            data={bookmarks}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
            ListEmptyComponent={
                <View style={styles.emptyState}>
                    <Backpack size={64} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>Tas Kosong</Text>
                    <Text style={styles.emptyDesc}>
                        Simpan materi favoritmu di sini untuk dipelajari nanti.
                    </Text>
                </View>
            }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.cream,
    borderBottomWidth: 2,
    borderBottomColor: colors.sand,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.sand,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 20,
    color: colors.dark,
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: colors.primary,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  itemWrapper: {
    marginBottom: 16,
  },
  cardOverride: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 3,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 14,
    color: colors.dark,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeBadge: {
    backgroundColor: colors.sand,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 8,
    color: colors.dark,
    textTransform: 'uppercase',
  },
  chapterText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 10,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 18,
    color: '#9CA3AF',
    marginTop: 16,
  },
  emptyDesc: {
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 250,
  },
});