import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Share,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { getAllStories, setStorySection } from '../glyphEyeCraftUtils';

const GlyphEyeStoryDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const storyId = route.params?.storyId;
  const [story, setStory] = useState(null);

  const SECTION_BUTTONS = [
    { key: 'plan', label: 'Plan to Read' },
    { key: 'reading', label: 'Reading' },
    { key: 'read', label: 'Read' },
  ];

  const loadGlyphStories = async () => {
    try {
      const allStories = (await getAllStories()) || [];
      const foundStr =
        allStories.find(storyGl => storyGl && storyGl.id === storyId) || null;
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
    loadGlyphStories();
  }, [storyId]);

  const changeGlyphSelSection = async newSection => {
    if (!story) return;
    try {
      const updStr = await setStorySection(story.id, newSection);
      if (updStr) {
        setStory(updStr);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onGlyphShare = async () => {
    if (!story) return;

    try {
      await Share.share({
        title: story.title || '',

        message: `${story.title || ''}\n\n${(story.content || '').substring(
          0,
          400,
        )}${(story.content || '').length > 400 ? '...' : ''}`,
      });
    } catch (err) {
      console.warn('Share error', err);
    }
  };

  if (!story) {
    return (
      <ImageBackground
        source={require('../../assets/images/glyphEyeSecBg.png')}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.glyphHeaderRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.backBtn,
                pressed && styles.isPressed,
              ]}
            >
              <Image source={require('../../assets/images/glyphEyeBack.png')} />
            </Pressable>

            <ImageBackground
              source={require('../../assets/images/glyphEyeHeader.png')}
              style={styles.glyphHeaderCenter}
              resizeMode="stretch"
            >
              <Text style={styles.glyphHeaderTitle}>All</Text>
            </ImageBackground>

            <View style={styles.headerBtnPlaceholder} />
          </View>

          <View style={styles.center}>
            <Text style={styles.notFoundText}>Story not found</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtnAction}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/glyphEyeSecBg.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glyphHeaderRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.isPressed,
            ]}
          >
            <Image source={require('../../assets/images/glyphEyeBack.png')} />
          </Pressable>

          <ImageBackground
            source={require('../../assets/images/glyphEyeHeader.png')}
            style={styles.glyphHeaderCenter}
            resizeMode="stretch"
          >
            <Text style={styles.glyphHeaderTitle}>All</Text>
          </ImageBackground>

          <Pressable
            onPress={onGlyphShare}
            style={({ pressed }) => [
              styles.headerBtn,
              pressed && styles.isPressed,
            ]}
          >
            <Image source={require('../../assets/images/glyphEyeShare.png')} />
          </Pressable>
        </View>

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

        <View style={{ marginTop: 18 }}>
          <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
            {SECTION_BUTTONS.map(b => (
              <TouchableOpacity
                key={b.key}
                onPress={() => changeGlyphSelSection(b.key)}
                style={[
                  styles.glyphSectionBtn,
                  story.section === b.key ? styles.glyphSectionActive : null,
                ]}
                disabled={!story}
              >
                <Text
                  style={[
                    styles.glyphSectionBtnText,
                    story.section === b.key
                      ? styles.glyphSectionActiveText
                      : null,
                  ]}
                >
                  {b.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginTop: 18 }}>
            <Text style={styles.glyphContentText}>{story.content}</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  glyphHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 50,
  },
  isPressed: {
    transform: [{ translateY: 2 }],
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  backBtnAction: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#e6ab7f',
    borderRadius: 8,
  },
  glyphHeaderCenter: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyphHeaderTitle: { color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 18 },
  glyphTitleCard: {
    width: 320,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    alignSelf: 'center',
    marginTop: 20,
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
  glyphSectionBtn: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: '#C28B64',
    borderRadius: 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphSectionBtnText: {
    color: '#F5E4D0',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  glyphSectionActive: { backgroundColor: '#3E6E14' },
  glyphSectionActiveText: {
    color: '#F5E4D0',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  glyphContentText: {
    marginTop: 8,
    color: '#F5E4D0',
    lineHeight: 22,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default GlyphEyeStoryDetail;
