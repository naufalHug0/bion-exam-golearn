import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { ArrowLeft, PlayCircle, BookOpen, CheckCircle, Lock } from 'lucide-react-native';

import API from '../services/api';
import { colors, GameCard, XPBar } from '../components/GameUI';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl } from 'react-native-gesture-handler';
import { useFocusEffect } from 'expo-router';

export default function SubjectDetailScreen({ route, navigation }) {
  const { id } = route.params; 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

    const fetchSubject = async (isRefreshing = false, isSilent = false) => {
        if (!isRefreshing && !data && !isSilent) setLoading(true);
        try {
        const res = await API.get(`/subjects/${id}`);
        setData(res.data.data);
        } catch (err) {
        console.log("Error fetch subject:", err);
        } finally {
        setLoading(false);
        setRefreshing(false);
        }
    };

  useFocusEffect(
    useCallback(() => {
      
      
      const isSilentRefresh = !!data; 
      fetchSubject(isSilentRefresh);
    }, [id]) 
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSubject(true); 
  }, [id]);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat Peta Level...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data && !loading) {
    return (
      <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Data Quest Tidak Ditemukan</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Kembali ke Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) return null;

  const activeGrade = data.grade ? String(data.grade) : '10';
  
  const grades = data.grades;
  const currentChapters = grades[activeGrade] || [];

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
            {data.subject.title}
        </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[colors.primary]} 
            tintColor={colors.primary} 
          />
        }
      >
        <View style={styles.tabsContainer}>
            <View style={[styles.tabButton, styles.tabActive]}>
                <Text style={[styles.tabText, { color: colors.white }]}>
                    KELAS {activeGrade}
                </Text>
            </View>
        </View>

        <View style={styles.roadmapContainer}>
          <View style={styles.connectorLine} />

          {currentChapters.length === 0 ? (
             <View style={styles.emptyChapter}>
                <Lock size={40} color="#D1D5DB" />
                <Text style={styles.emptyText}>Belum ada quest di kelas ini!</Text>
             </View>
          ) : (
            currentChapters.map((chapter, index) => (
              <View key={chapter._id} style={styles.chapterRow}>
                
                <View style={[
                    styles.nodeCircle, 
                    chapter.progress > 0 ? styles.nodeActive : styles.nodeInactive
                ]}>
                    <Text style={[
                        styles.nodeText,
                        chapter.progress > 0 ? { color: colors.white } : { color: '#9CA3AF' }
                    ]}>
                        {index + 1}
                    </Text>
                </View>

                <GameCard style={styles.chapterCard}>
                    <View style={styles.chapterHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.chapterTitle}>{chapter.title}</Text>
                            <Text style={styles.materialCount}>
                                {chapter.materials?.length || 0} Misi Tersedia
                            </Text>
                        </View>
                        <View style={{ width: 60 }}>
                            <XPBar 
                                progress={chapter.progress || 0} 
                                color="#10B981" 
                                height={8} 
                                showLabel={false} 
                            />
                        </View>
                    </View>

                    <View style={styles.materialsList}>
                        {chapter.materials?.map((mat) => (
                            <TouchableOpacity
                                key={mat._id}
                                onPress={() => {
                                    navigation.navigate('MaterialView', { 
                                        id: mat._id,
                                        chapterId: chapter._id,
                                        materialData: mat,
                                        subjectData: data.subject
                                    });
                                }}
                                style={[
                                    styles.materialItem,
                                    mat.isCompleted && styles.materialCompleted
                                ]}
                            >
                                <View style={[
                                    styles.iconBox, 
                                    mat.isCompleted ? styles.iconBoxDone : styles.iconBoxActive
                                ]}>
                                    {mat.type === 'video' ? (
                                        <PlayCircle size={18} color={mat.isCompleted ? "#10B981" : colors.white} />
                                    ) : (
                                        <BookOpen size={18} color={mat.isCompleted ? "#10B981" : colors.white} />
                                    )}
                                </View>
                                
                                <View style={{ flex: 1 }}>
                                    <Text style={[
                                        styles.materialTitle,
                                        mat.isCompleted && { textDecorationLine: 'line-through', color: '#9CA3AF' }
                                    ]}>
                                        {mat.title}
                                    </Text>
                                    <Text style={styles.materialType}>{mat.type}</Text>
                                </View>

                                {mat.isCompleted && (
                                    <CheckCircle size={20} color="#10B981" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </GameCard>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16,
    color: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: colors.dark,
    marginBottom: 8,
  },
  backLink: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.cream,
    borderBottomWidth: 2,
    borderBottomColor: colors.sand,
  },
  backButton: {
    padding: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.sand,
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 20,
    color: colors.dark,
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  
  tabsContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  tabActive: {
    backgroundColor: colors.secondary,
    borderColor: '#5A8A95', 
  },
  tabInactive: {
    backgroundColor: colors.white,
    borderColor: colors.sand,
  },
  tabText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 14,
  },

  
  roadmapContainer: {
    paddingHorizontal: 20,
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    left: 40, 
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.sand,
    zIndex: -1,
    borderRadius: 2,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    marginBottom: 24,
  },
  
  
  nodeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    marginRight: 16,
    backgroundColor: colors.white,
    zIndex: 1, 
  },
  nodeActive: {
    backgroundColor: colors.primary,
    borderColor: '#8A3333',
  },
  nodeInactive: {
    backgroundColor: colors.white,
    borderColor: colors.sand,
  },
  nodeText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16,
  },

  
  chapterCard: {
    flex: 1, 
    padding: 16,
    minHeight: 100,
    borderWidth: 3,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.sand,
    paddingBottom: 8,
  },
  chapterTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16,
    color: colors.dark,
    marginBottom: 2,
    marginRight: 8,
  },
  materialCount: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: colors.secondary,
  },
  
  
  materialsList: {
    gap: 8,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.sand,
  },
  materialCompleted: {
    backgroundColor: '#ECFDF5', 
    borderColor: '#A7F3D0',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconBoxActive: {
    backgroundColor: colors.primary,
  },
  iconBoxDone: {
    backgroundColor: '#D1FAE5', 
    borderWidth: 1,
    borderColor: '#10B981',
  },
  materialTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: colors.dark,
  },
  materialType: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 8,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  
  
  emptyChapter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.sand,
    borderStyle: 'dashed',
    marginLeft: 60, 
  },
  emptyText: {
    marginTop: 8,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});