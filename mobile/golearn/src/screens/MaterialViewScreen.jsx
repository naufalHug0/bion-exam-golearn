import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, 
  KeyboardAvoidingView, Platform, TextInput 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import { ArrowLeft, Bookmark, Download, MessageSquare, Send, CheckCircle, PlayCircle, FileText, MonitorPlay } from 'lucide-react-native';

import API, { getFileUrl } from '../services/api';
import { colors, GameCard, GameButton } from '../components/GameUI';
import {useAlertStore} from '../store/useStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MaterialViewScreen({ route, navigation }) {
  const { id, chapterId, materialData, subjectData } = route.params;
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completed, setCompleted] = useState(materialData.isCompleted || false);
  const [loadingComments, setLoadingComments] = useState(true);

  const showAlert = useAlertStore((state) => state.showAlert);
  const videoRef = useRef(null);

  const contentUrl = getFileUrl(materialData.contentUrl);

  const updateLocalXP = async (newXp) => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        parsedUser.xp = newXp; 
        await AsyncStorage.setItem('user_data', JSON.stringify(parsedUser));
      }
    } catch (e) {
      console.log("Gagal update local XP:", e);
    }
  };

  useEffect(() => {
    fetchBookmarkStatus();
    if (chapterId) fetchComments();
  }, [id]);

  const fetchBookmarkStatus = async () => {
    try {
      const res = await API.get('/interactions/bookmark');
      const found = res.data.data.find(b => b.material._id === id);
      setIsBookmarked(!!found);
    } catch (e) { console.log(e); }
  };

  const fetchComments = async () => {
    try {
      const res = await API.get(`/interactions/comment/${chapterId}`);
      setComments(res.data.data);
    } catch (e) { console.log(e); } 
    finally { setLoadingComments(false); }
  };

  const handleComplete = async () => {
    if (completed) return;
    try {
        const res = await API.post('/interactions/progress', { materialId: id });
        setCompleted(true);
        
        if(res.data.data?.xpGained > 0) {

            await updateLocalXP(res.data.data.currentXp);
            
            showAlert({
                title: "LEVEL UP!",
                message: `Selamat! Kamu mendapatkan +${res.data.data.xpGained} XP.`,
                type: "success",
                buttonText: "LANJUT"
            });
        }
    } catch (err) {
        console.log(err);
    }
  };

  const handleBookmark = async () => {
    try {
        await API.post('/interactions/bookmark', { materialId: id });
        setIsBookmarked(!isBookmarked);
        showAlert({
            title: isBookmarked ? "Dihapus" : "Tersimpan",
            message: isBookmarked ? "Dihapus dari Inventory." : "Materi disimpan ke Inventory!",
            type: "info"
        });
    } catch (err) { console.log(err); }
  };

  const handlePostComment = async () => {
      if(!newComment.trim()) return;
      try {
          await API.post('/interactions/comment', { chapterId, content: newComment });
          showAlert({ title: "Terkirim", message: "Komentar berhasil dikirim! Kamu mendapat +5 XP!", type: "success" });
          setNewComment('');
          fetchComments(); 
        
          const userData = await AsyncStorage.getItem('user_data');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            const currentXp = parsedUser.xp || 0;
            await updateLocalXP(currentXp + 5);
          }

      } catch (err) {
          showAlert({ title: "Gagal", message: "Gagal mengirim pesan.", type: "error" });
      }
  };

  
  const renderViewer = () => {
      if (materialData.type === 'video') {
          return (
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{ uri: contentUrl }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={status => {
                        if (status.didJustFinish) {
                            handleComplete();
                        }
                    }}
                />
            </View>
          );
      } else if (materialData.type === 'pdf') {
          const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(contentUrl)}`;
          return (
              <View style={styles.webviewContainer}>
                  <WebView 
                    source={{ uri: contentUrl.includes('localhost') ? contentUrl : googleDocsUrl }} 
                    style={{ flex: 1 }}
                      startInLoadingState={true}
                      renderLoading={() => <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                  />
              </View>
          );
      } else {
          
          return (
              <View style={styles.fallbackContainer}>
                  <MonitorPlay size={64} color={colors.white} />
                  <Text style={styles.fallbackTitle}>Slide Presentasi</Text>
                  <Text style={styles.fallbackDesc}>
                    Format file ini lebih baik dilihat di layar lebar.
                  </Text>
                  {materialData.isDownloadable && (
                      <View style={styles.downloadBadge}>
                          <Download size={16} color={colors.primary} />
                          <Text style={styles.downloadText}>Tersedia untuk Download</Text>
                      </View>
                  )}
              </View>
          );
      }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fffff' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.dark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{materialData.title}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.viewerFrame}>
                {renderViewer()}
            </View>

            <GameCard style={styles.actionCard}>
                <View>
                    <Text style={styles.materialTitle}>{materialData.title}</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{materialData.type.toUpperCase()}</Text>
                        </View>
                        {subjectData && <Text style={styles.subjectText}>• {subjectData.title}</Text>}
                    </View>
                </View>

                <View style={styles.controlsRow}>
                    <TouchableOpacity 
                        onPress={handleBookmark}
                        style={[styles.iconBtn, isBookmarked && styles.iconBtnActive]}
                    >
                        <Bookmark 
                            size={24} 
                            color={isBookmarked ? colors.white : "#9CA3AF"} 
                            fill={isBookmarked ? colors.white : "none"} 
                        />
                    </TouchableOpacity>

                    <GameButton 
                        variant={completed ? "secondary" : "primary"}
                        onPress={handleComplete}
                        style={[{ flex: 1, paddingVertical: 12 }, completed && { backgroundColor: '#7EACB5' }]}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            {completed && <CheckCircle size={18} color="white" />}
                            <Text style={{ color: 'white', fontFamily: 'PlusJakartaSans-Bold' }}>
                                {completed ? "SELESAI" : "TANDAI SELESAI"}
                            </Text>
                        </View>
                    </GameButton>
                </View>
            </GameCard>

            <GameCard style={styles.forumCard}>
                <View style={styles.forumHeader}>
                    <View style={styles.forumIcon}>
                        <MessageSquare size={20} color={colors.white} />
                    </View>
                    <View>
                        <Text style={styles.forumTitle}>Forum Kelas</Text>
                        <Text style={styles.forumSubtitle}>Diskusi (+5 XP)</Text>
                    </View>
                </View>

                <View style={styles.commentsList}>
                    {loadingComments ? (
                        <ActivityIndicator color={colors.primary} />
                    ) : comments.length === 0 ? (
                        <Text style={styles.emptyComments}>Jadilah yang pertama berkomentar!</Text>
                    ) : (
                        comments.map((c) => (
                            <View key={c._id} style={styles.commentItem}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{c.userId?.name?.[0]}</Text>
                                </View>
                                <View style={styles.commentContent}>
                                    <View style={styles.commentUserRow}>
                                        <Text style={styles.commentUser}>{c.userId?.name}</Text>
                                        <View style={styles.xpBadge}>
                                            <Text style={styles.xpText}>{c.userId?.xp || 0} XP</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.commentText}>{c.content}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.inputRow}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Tulis pertanyaan..."
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                    />
                    <TouchableOpacity 
                        onPress={handlePostComment}
                        disabled={!newComment.trim()}
                        style={[
                            styles.sendBtn, 
                            !newComment.trim() && { backgroundColor: '#E5E7EB', borderColor: '#D1D5DB' }
                        ]}
                    >
                        <Send size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </GameCard>

        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 18,
    color: colors.dark,
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  
  viewerFrame: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: colors.dark,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: colors.dark,
    overflow: 'hidden',
    marginBottom: 20,
    
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 20,
  },
  fallbackTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 20,
    color: colors.white,
    marginTop: 12,
  },
  fallbackDesc: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  downloadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  downloadText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: colors.primary,
  },

  
  actionCard: {
    marginBottom: 20,
    padding: 16,
  },
  materialTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 20,
    color: colors.dark,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  badge: {
    backgroundColor: colors.sand,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: colors.dark,
  },
  subjectText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#9CA3AF',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.sand,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  iconBtnActive: {
    backgroundColor: '#EAB308', 
    borderColor: '#CA8A04',
  },

  
  forumCard: {
    padding: 16,
    minHeight: 300,
  },
  forumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.sand,
    paddingBottom: 12,
    marginBottom: 12,
    gap: 12,
  },
  forumIcon: {
    backgroundColor: colors.secondary,
    padding: 8,
    borderRadius: 12,
  },
  forumTitle: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16,
    color: colors.dark,
  },
  forumSubtitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#9CA3AF',
  },
  commentsList: {
    gap: 12,
    marginBottom: 20,
  },
  emptyComments: {
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#9CA3AF',
    marginTop: 20,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.sand,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.dark,
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: colors.white,
    fontSize: 14,
  },
  commentContent: {
    flex: 1,
  },
  commentUserRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 12,
    color: colors.dark,
  },
  xpBadge: {
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EAB308',
  },
  xpText: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#854D0E',
  },
  commentText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  
  
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.sand,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: colors.dark,
    minHeight: 48,
  },
  sendBtn: {
    width: 48,
    height: 48,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#5A8A95',
  },
});