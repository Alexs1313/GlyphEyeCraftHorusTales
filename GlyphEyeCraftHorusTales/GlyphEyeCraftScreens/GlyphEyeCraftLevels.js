import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ImageBackground,
  ScrollView,
  Pressable,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { getProgress } from '../glyphEyeCraftUtils';

const GlyphEyeCraftLevels = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState({
    highestUnlocked: 1,
    completed: [],
  });

  useFocusEffect(
    useCallback(() => {
      loadGlyphLevelsProgress();

      const glyphUnsub = navigation.addListener(
        'focus',
        loadGlyphLevelsProgress,
      );
      return () => {
        if (typeof glyphUnsub === 'function') glyphUnsub();
      };
    }, [navigation, getProgress]),
  );

  const loadGlyphLevelsProgress = async () => {
    try {
      let svdPrg = null;
      if (typeof getProgress === 'function') {
        svdPrg = await getProgress();
      }

      if (
        !svdPrg ||
        typeof svdPrg !== 'object' ||
        svdPrg.highestUnlocked == null
      ) {
        const svdPrg2 = await getProgress();
        if (svdPrg2 && typeof svdPrg2 === 'object') {
          svdPrg = svdPrg2;
        }
      }

      const nrmlzdSvdDta = {
        highestUnlocked:
          svdPrg && Number.isFinite(svdPrg.highestUnlocked)
            ? svdPrg.highestUnlocked
            : 1,
        completed: Array.isArray(svdPrg && svdPrg.completed)
          ? svdPrg.completed.map(Number)
          : [],
      };

      setProgress(nrmlzdSvdDta);
    } catch (err) {
      console.warn('Failed to load progress =>', err);

      setProgress({ highestUnlocked: 1, completed: [] });
    }
  };

  const openGlyphPage = pageNumber => {
    if (pageNumber <= progress.highestUnlocked) {
      navigation.navigate('GlyphEyeCraftGame', { pageIndex: pageNumber - 1 });
    } else {
      return;
    }
  };

  const glyphPageCard = ({ item: selectedPageNumber }) => {
    const isUnlockedPage = selectedPageNumber <= progress.highestUnlocked;

    return (
      <TouchableOpacity
        style={styles.pageButton}
        activeOpacity={0.85}
        onPress={() => openGlyphPage(selectedPageNumber)}
      >
        <ImageBackground
          style={[styles.glyphPageRow]}
          resizeMode="contain"
          source={require('../../assets/images/glyphEyeHeader.png')}
        >
          {!isUnlockedPage && (
            <Image
              source={require('../../assets/images/glyphLock.png')}
              style={styles.glyphLockIcon}
            />
          )}

          <Text style={[styles.glyphPageText]}>Page {selectedPageNumber}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const glyphPages = Array.from({ length: 16 }, (_, index) => index + 1);

  return (
    <ImageBackground
      source={require('../../assets/images/glyphEyeSecBg.png')}
      style={styles.glyphBx}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.glyphHdrWrp}>
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
            resizeMode="stretch"
            style={styles.glyphHdrCtr}
          >
            <Text style={styles.glyphHdrTitle}>Pages</Text>
          </ImageBackground>

          <Pressable
            onPress={() => navigation.navigate('GlyphEyeCraftSettings')}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.isPressed,
            ]}
          >
            <Image source={require('../../assets/images/glyphEyeSett.png')} />
          </Pressable>
        </View>

        <FlatList
          data={glyphPages}
          keyExtractor={n => String(n)}
          scrollEnabled={false}
          renderItem={glyphPageCard}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  glyphBx: {
    flex: 1,
    paddingHorizontal: 24,
  },
  glyphHdrWrp: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    marginBottom: 30,
    paddingTop: 60,
  },
  isPressed: {
    transform: [{ translateY: 2 }],
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  glyphHdrCtr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  glyphHdrTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
  pageButton: {
    height: 56,
    width: '100%',
    marginBottom: 15,
    justifyContent: 'center',
  },
  glyphPageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 14,
    paddingHorizontal: 16,
  },
  glyphPageText: { color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 20 },
  glyphLockIcon: { width: 24, height: 24, tintColor: '#fff' },
  completedWrap: { width: 24, alignItems: 'center' },
  completedText: { color: '#fff', fontFamily: 'Poppins-Bold' },
});

export default GlyphEyeCraftLevels;
