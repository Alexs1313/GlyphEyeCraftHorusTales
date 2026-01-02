import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Share,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { getAllGlyphStories } from '../glyphEyeCraftUtils';

const GlyphEyeMyStories = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const storyId = route.params?.storyId;
  const [story, setStory] = useState(null);

  const loadGlyphStory = async () => {
    try {
      const allStories = (await getAllGlyphStories()) || [];

      const foundStr = allStories.find(s => s.id === storyId) || null;

      setStory(foundStr);
    } catch (err) {
      console.warn('Failed to load story =>', err);
      setStory(null);
    }
  };

  useEffect(() => {
    if (!storyId) {
      setStory(null);

      return;
    }
    loadGlyphStory();
  }, [storyId]);

  const onGlyphStoryShare = async () => {
    if (!story) return;
    try {
      await Share.share({
        title: story.title,
        message: `${story.title}\n\n${(story.content || '').substring(
          0,
          400,
        )}...`,
      });
    } catch (err) {
      console.warn('Share error =>', err);
    }
  };

  if (!story) {
    return (
      <ImageBackground
        source={require('../../assets/images/glyphEyeSecBg.png')}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.glyphHeaderRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.headerBtn,
                pressed && styles.isPressed,
              ]}
            >
              <Image source={require('../../assets/images/glyphEyeBack.png')} />
            </Pressable>

            <ImageBackground
              source={require('../../assets/images/glyphEyeHeader.png')}
              resizeMode="stretch"
              style={styles.headerCenter}
            >
              <Text style={styles.headerTitle}>My Stories</Text>
            </ImageBackground>

            <View style={styles.headerBtn} />
          </View>

          <View style={styles.center}>
            <Text style={styles.notFoundText}>Story not found</Text>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.backBtn,
                pressed && styles.isPressed,
              ]}
            >
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/glyphEyeSecBg.png')}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.glyphHeaderRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.headerBtn,
              pressed && styles.isPressed,
            ]}
          >
            <Image source={require('../../assets/images/glyphEyeBack.png')} />
          </Pressable>

          <ImageBackground
            source={require('../../assets/images/glyphEyeHeader.png')}
            resizeMode="contain"
            style={styles.glyphHeaderCenter}
          >
            <Text style={styles.glyphHeaderTitle}>My Stories</Text>
          </ImageBackground>

          <Pressable
            onPress={onGlyphStoryShare}
            style={({ pressed }) => [
              styles.headerBtn,
              pressed && styles.isPressed,
            ]}
          >
            <Image source={require('../../assets/images/glyphEyeShare.png')} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 36 }}>
          <View style={{ alignItems: 'center' }}>
            <ImageBackground
              source={require('../../assets/images/glyphgmBoard.png')}
              resizeMode="stretch"
              style={styles.glyphTitleCard}
            >
              <Text style={styles.glyphTitleText}>{story.title}</Text>
              <View style={styles.glyphGenrePill}>
                <Text style={styles.glyphGenreText}>{story.genre}</Text>
              </View>
            </ImageBackground>
          </View>

          <View style={{ marginTop: 18 }}>
            <Text style={styles.glyphContentText}>{story.content}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  glyphHeaderRow: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  glyphHeaderCenter: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyphHeaderTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
  isPressed: {
    transform: [{ translateY: 2 }],
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  glyphTitleCard: {
    width: 320,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  glyphTitleText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#964B2B',
    textAlign: 'center',
  },
  glyphGenrePill: {
    marginTop: 10,
    backgroundColor: '#C28B64',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphGenreText: {
    color: '#F5E4D0',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  glyphContentText: {
    color: '#F5E4D0',
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 24,
    fontSize: 16,
    marginBottom: 6,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff' },
  notFoundText: { color: '#fff', fontSize: 16 },
  headerBtn: { padding: 6 },
  backBtn: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#e6ab7f',
    borderRadius: 8,
  },
  backText: { color: '#5C1B00', fontFamily: 'Poppins-Bold' },
});

export default GlyphEyeMyStories;
