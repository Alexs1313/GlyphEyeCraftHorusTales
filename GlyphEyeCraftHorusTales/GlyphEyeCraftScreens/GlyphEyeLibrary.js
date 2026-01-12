import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { initialStories } from '../GlyphEyeCraftData/initialStories';

import {
  ensureInitialStories,
  getAllStories,
  getUserStories,
  saveUserStories,
} from '../glyphEyeCraftUtils';

import { useGlyphEyeStore } from '../GlyphEyeCraftStore/glyphEyeCraftCntxt';
import { BlurView } from '@react-native-community/blur';

const SECTIONS = [
  { key: 'all', label: 'All' },
  { key: 'plan', label: 'Plan to Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'read', label: 'Read' },
];

const GlyphEyeLibrary = () => {
  const navigation = useNavigation();
  const { glyphEyeNotificationsEnabled } = useGlyphEyeStore();

  const [allStories, setAllStories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [content, setContent] = useState('');

  // INIT
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        await ensureInitialStories(initialStories);

        const systemStories = (await getAllStories()) || [];
        setAllStories(systemStories);

        const storedUserStories = await getUserStories();
        setUserStories(storedUserStories);
      };
      init();
    }, []),
  );

  // ADD USER STORY
  const onSaveNewStory = () => {
    if (!title.trim()) {
      Alert.alert('Please enter a title.');
      return;
    }

    const newStory = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      genre: genre.trim() || 'Unknown',
      content: content.trim() || '',
      section: 'all',
      isUser: true,
    };

    setUserStories(prev => {
      const updated = [newStory, ...prev];
      saveUserStories(updated);
      return updated;
    });

    if (glyphEyeNotificationsEnabled) {
      Toast.show({
        type: 'success',
        text1: 'Legend added!',
      });
    }

    setModalVisible(false);
    setTitle('');
    setGenre('');
    setContent('');
  };

  // DELETE USER STORY
  const onLongPressDelete = storyId => {
    Alert.alert(
      'Delete Legend',
      'Are you sure you want to delete this legend from your library? This action cannot be undone',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUserStories(prev => {
              const updated = prev.filter(story => story.id !== storyId);
              saveUserStories(updated);
              return updated;
            });

            if (glyphEyeNotificationsEnabled) {
              Toast.show({
                type: 'success',
                text1: 'Legend deleted!',
              });
            }
          },
        },
      ],
    );
  };

  const openGlyphStorySection = key => {
    navigation.navigate('GlyphEyeLibrarySection', { section: key });
  };

  const glyphCreatedCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('GlyphEyeMyStories', { storyId: item.id })
      }
      onLongPress={() => onLongPressDelete(item.id)}
    >
      <ImageBackground
        source={require('../../assets/images/glyphgmBoard.png')}
        resizeMode="stretch"
        style={styles.glyphStoryCard}
      >
        <Text style={styles.glyphStoryTitle}>{item.title}</Text>
        <View style={styles.glyphGenreRow}>
          <View style={styles.glyphSectionPill}>
            <Text style={styles.glyphSectionPillText}>{item.genre}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/glyphEyeSecBg.png')}
      style={styles.glyphView}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glyphHeader}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.glyphBackBtn,
              pressed && styles.isPressed,
            ]}
          >
            <Image source={require('../../assets/images/glyphEyeBack.png')} />
          </Pressable>

          <ImageBackground
            source={require('../../assets/images/glyphEyeHeader.png')}
            style={styles.glyphHeaderWrap}
            resizeMode="contain"
          >
            <Text style={styles.glyphHeaderTitle}>Library</Text>
          </ImageBackground>
        </View>

        {/* SECTIONS */}
        <View style={styles.glyphSectionGrid}>
          {SECTIONS.map(s => (
            <TouchableOpacity
              key={s.key}
              activeOpacity={0.8}
              style={styles.glyphSectionTile}
              onPress={() => openGlyphStorySection(s.key)}
            >
              <Image
                source={
                  s.key === 'all'
                    ? require('../../assets/images/glyphIconAll.png')
                    : s.key === 'plan'
                    ? require('../../assets/images/glyphIconPlan.png')
                    : s.key === 'reading'
                    ? require('../../assets/images/glyphIconReading.png')
                    : require('../../assets/images/glyphIconRead.png')
                }
              />
              <Text style={styles.glyphSectionLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MY STORIES */}
        <View style={{ marginTop: 18, alignItems: 'center' }}>
          <ImageBackground
            source={require('../../assets/images/glyphEyeHeader.png')}
            style={styles.glyphMyStoriesHeader}
            resizeMode="stretch"
          >
            <Text style={styles.glyphMyStoriesText}>My Stories</Text>
          </ImageBackground>

          <TouchableOpacity
            style={styles.glyphAddBtn}
            onPress={() => setModalVisible(true)}
          >
            <Image source={require('../../assets/images/glyphIconAdd.png')} />
          </TouchableOpacity>

          <View style={{ width: '100%', marginTop: 12, paddingHorizontal: 4 }}>
            {userStories.length > 0 ? (
              <FlatList
                data={userStories}
                keyExtractor={i => i.id}
                renderItem={glyphCreatedCard}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No stories yet</Text>
            )}
          </View>
        </View>

        {Platform.OS === 'android' && (
          <Image
            source={require('../../assets/images/grape.png')}
            style={{
              width: 250,
              height: 250,
              resizeMode: 'contain',
              position: 'absolute',
              bottom: 0,
              right: -50,
              zIndex: -1,
            }}
          />
        )}
      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={Platform.OS === 'android'}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="black"
        />
        <View style={styles.glyphModalOverlay}>
          <View style={styles.glyphModalCard}>
            <View style={styles.glyphModalHeader}>
              <Text style={styles.glyphModalTitle}>Add New Work</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Image
                  source={require('../../assets/images/glyphEyeCloseMdl.png')}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.glyphFieldLabel}>Legend Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter legend title ..."
              placeholderTextColor="#FFFFFF99"
              style={styles.glyphInput}
            />

            <Text style={[styles.glyphFieldLabel, { marginTop: 12 }]}>
              Genre
            </Text>
            <TextInput
              value={genre}
              onChangeText={setGenre}
              placeholder="Genre"
              placeholderTextColor="#FFFFFF99"
              style={styles.glyphInput}
            />

            <Text style={[styles.glyphFieldLabel, { marginTop: 12 }]}>
              Story
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Your papyrus awaits the first line..."
              placeholderTextColor="#FFFFFF99"
              style={[
                styles.glyphInput,
                { height: 140, textAlignVertical: 'top', marginBottom: 26 },
              ]}
              multiline
            />

            <TouchableOpacity onPress={onSaveNewStory}>
              <ImageBackground
                source={require('../../assets/images/glyphEyeBtn.png')}
                resizeMode="stretch"
                style={{
                  height: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.glyphSaveBtnText}>Save</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  glyphView: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  glyphHeader: {
    flexDirection: 'row',
    marginTop: 60,
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  isPressed: {
    transform: [{ translateY: 2 }],
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  glyphHeaderWrap: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyphHeaderTitle: { color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 18 },
  glyphSectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  glyphSectionTile: {
    width: '47%',
    height: 140,
    backgroundColor: '#C28B64',
    borderRadius: 2,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyphSectionLabel: {
    marginTop: 8,
    color: '#5C1B00',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  glyphMyStoriesHeader: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyphMyStoriesText: {
    color: '#FFEAE1',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
  glyphAddBtn: { marginTop: 18 },
  emptyText: {
    color: '#d6b39a',
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  glyphStoryCard: {
    padding: 16,
    minHeight: 130,
    justifyContent: 'center',
    marginBottom: 12,
  },
  glyphStoryTitle: {
    color: '#964B2B',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  glyphSectionPill: {
    backgroundColor: '#C28B64',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  glyphSectionPillText: {
    color: '#F5E4D0',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  glyphModalOverlay: {
    flex: 1,
    backgroundColor:
      Platform.OS === 'android' ? 'rgba(0,0,0,0.45)' : 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  glyphModalCard: {
    backgroundColor: '#4A1300',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    paddingTop: 33,
    height: '85%',
  },
  glyphModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  glyphModalTitle: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  glyphFieldLabel: {
    color: '#FFC765',
    marginTop: 24,
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    marginBottom: 4,
  },
  glyphInput: {
    marginTop: 4,
    backgroundColor: '#C28B64',
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 2,
    fontFamily: 'Poppins-Medium',
  },
  glyphSaveBtn: {
    marginTop: 16,
    backgroundColor: '#e6ab7f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  glyphSaveBtnText: {
    color: '#964B2B',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
});

export default GlyphEyeLibrary;
