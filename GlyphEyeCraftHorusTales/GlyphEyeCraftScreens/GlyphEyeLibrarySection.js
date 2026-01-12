import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';

import { getAllStories } from '../glyphEyeCraftUtils';

const GlyphEyeLibrarySection = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const sectionParam = route.params?.section ?? 'all';
  const [stories, setStories] = useState([]);

  const SECTION_LABEL = {
    all: 'All',
    plan: 'Plan to Read',
    reading: 'Reading',
    read: 'Read',
  };

  useFocusEffect(
    useCallback(() => {
      loadGlyphStories();
    }, [sectionParam]),
  );

  const loadGlyphStories = async () => {
    const allStories = (await getAllStories()) || [];

    const filteredStrs =
      sectionParam === 'all'
        ? allStories
        : allStories.filter(storyGlyph => storyGlyph.section === sectionParam);
    setStories(filteredStrs);
  };

  const storyCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.glyphStoryCardWrap}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('GlyphEyeStoryDetail', { storyId: item.id })
        }
      >
        <ImageBackground
          source={require('../../assets/images/glyphgmBoard.png')}
          resizeMode="stretch"
          style={styles.glyphStoryCard}
        >
          <Text style={styles.glyphStoryTitle}>{item.title}</Text>
          <View style={styles.glyphGenreRow}>
            <View style={styles.glyphGenrePill}>
              <Text style={styles.glyphGenreText}>{item.genre}</Text>
            </View>
            <View style={styles.glyphSectionPill}>
              <Text style={styles.glyphSectionPillText}>
                {item.section === 'all'
                  ? 'All'
                  : item.section === 'plan'
                  ? 'Plan to Read'
                  : item.section === 'reading'
                  ? 'Reading'
                  : 'Read'}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/glyphEyeSecBg.png')}
      style={styles.glyphViewBg}
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
            style={styles.glyphHeaderCenter}
            resizeMode="contain"
          >
            <Text style={styles.glyphHeaderTitle}>
              {SECTION_LABEL[sectionParam] || 'All'}
            </Text>
          </ImageBackground>
        </View>

        <FlatList
          data={stories}
          keyExtractor={idx => idx.id}
          renderItem={storyCard}
          contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 4 }}
          scrollEnabled={false}
        />

        {stories.length === 0 && (
          <View
            style={{ flex: 1, alignItems: 'center', marginTop: 50, bottom: 60 }}
          >
            <Image
              source={require('../../assets/images/glyphEyeEmpty.png')}
              style={{ top: 20 }}
            />
            <ImageBackground
              source={require('../../assets/images/glyphgmBoard.png')}
              resizeMode="stretch"
              style={[
                styles.storyCard,
                {
                  padding: 20,
                  paddingHorizontal: 30,
                  minHeight: 130,
                  width: 340,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <Text
                style={{
                  color: '#964B2B',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 16,
                  textAlign: 'center',
                }}
              >
                Your library is quiet. Start a tale now or move one here anytime
              </Text>
            </ImageBackground>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.allBtn}
              onPress={() => navigation.navigate('GlyphEyeLibrary')}
            >
              <Image
                source={require('../../assets/images/glyphEyeAllBtn.png')}
              />
              <Text style={styles.allBtnText}>All</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  glyphViewBg: { flex: 1, paddingHorizontal: 20 },
  glyphHeader: {
    flexDirection: 'row',
    marginTop: 60,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    gap: 8,
  },
  isPressed: {
    transform: [{ translateY: 2 }],
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  glyphHeaderCenter: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyphHeaderTitle: { color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 18 },
  glyphHeaderRightPlaceholder: { width: 40 },
  glyphStoryCardWrap: { marginBottom: 14 },
  glyphStoryCard: {
    padding: 16,
    minHeight: 130,
    justifyContent: 'center',
    width: 345,
    alignSelf: 'center',
  },
  glyphStoryTitle: {
    color: '#964B2B',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  glyphGenreRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
  },
  glyphGenreText: {
    color: '#F5E4D0',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  glyphSectionPill: {
    backgroundColor: '#C28B64',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  glyphGenrePill: {
    backgroundColor: '#C28B64',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  glyphSectionPillText: {
    color: '#F5E4D0',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  allBtn: {
    width: 170,
    height: 68,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C28B64',
    borderRadius: 2,
    flexDirection: 'row',
    gap: 12,
  },
  allBtnText: {
    color: '#5C1B00',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});

export default GlyphEyeLibrarySection;
