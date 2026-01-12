import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

// locals
import GlyphEyeCraftButton from '../GlyphEyeCraftComponents/GlyphEyeCraftButton';
import { useGlyphEyeStore } from '../GlyphEyeCraftStore/glyphEyeCraftCntxt';

const GlyphEyeCraftHome = () => {
  const navigation = useNavigation();
  const [glyphMusIdx, setGlyphMusIdx] = useState(0);
  const [sound, setSound] = useState(null);
  const glyphTracksCycle = ['background-music.wav', 'background-music.wav'];
  const {
    setGlyphEyeNotificationsEnabled,
    glyphEyeSoundEnabled,
    setGlyphEyeSoundEnabled,
  } = useGlyphEyeStore();

  useFocusEffect(
    useCallback(() => {
      loadGlyphBgMusic();

      loadGlyphVibration();
    }, []),
  );

  useEffect(() => {
    playGlyphMusic(glyphMusIdx);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [glyphMusIdx]);

  const playGlyphMusic = index => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const glyphTrackPath = glyphTracksCycle[index];

    const newGlyphGameSound = new Sound(
      glyphTrackPath,

      Sound.MAIN_BUNDLE,

      error => {
        if (error) {
          console.log('Error =>', error);
          return;
        }

        newGlyphGameSound.play(success => {
          if (success) {
            setGlyphMusIdx(
              prevIndex => (prevIndex + 1) % glyphTracksCycle.length,
            );
          } else {
            console.log('Error =>');
          }
        });
        setSound(newGlyphGameSound);
      },
    );
  };

  useEffect(() => {
    const setVolumeGameMusic = async () => {
      try {
        const glyphMusicValue = await AsyncStorage.getItem('toggleSound');

        const isGlyphMusicOn = JSON.parse(glyphMusicValue);
        setGlyphEyeSoundEnabled(isGlyphMusicOn);
        if (sound) {
          sound.setVolume(isGlyphMusicOn ? 1 : 0);
        }
      } catch (error) {
        console.error('Error =>', error);
      }
    };

    setVolumeGameMusic();
  }, [sound]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(glyphEyeSoundEnabled ? 1 : 0);
    }
  }, [glyphEyeSoundEnabled]);

  const loadGlyphVibration = async () => {
    try {
      const glyphVibrationValue = await AsyncStorage.getItem(
        'toggleNotifications',
      );
      if (glyphVibrationValue !== null) {
        const isGlyphVibrationOn = JSON.parse(glyphVibrationValue);
        setGlyphEyeNotificationsEnabled(isGlyphVibrationOn);
      }
    } catch (error) {
      console.error('Error!', error);
    }
  };

  const loadGlyphBgMusic = async () => {
    try {
      const glyphMusicValue = await AsyncStorage.getItem('toggleSound');
      const isGlyphMusicOn = JSON.parse(glyphMusicValue);
      setGlyphEyeSoundEnabled(isGlyphMusicOn);
    } catch (error) {
      console.error('Error loading settings =>', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/glyphEyeMainBg.png')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glyphEyeView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              paddingHorizontal: 10,
              marginBottom: 20,
            }}
          >
            <Pressable
              style={({ pressed }) => [pressed && styles.isPressed]}
              onPress={() => navigation.navigate('GlyphEyeCraftAbout')}
            >
              <Image
                source={require('../../assets/images/glyphEyeAbout.png')}
              />
            </Pressable>
            <Pressable
              style={({ pressed }) => [pressed && styles.isPressed]}
              onPress={() => navigation.navigate('GlyphEyeCraftSettings')}
            >
              <Image source={require('../../assets/images/glyphEyeSett.png')} />
            </Pressable>
          </View>
          <View>
            <Image
              source={require('../../assets/images/glyphEyeCraftLoaderLogo.png')}
              style={{ top: 20, width: 380, height: 180 }}
            />
          </View>

          <View>
            <Image
              source={require('../../assets/images/glyphEyeCat.png')}
              style={{ zIndex: 1 }}
            />
            {Platform.OS === 'android' && (
              <Image
                source={require('../../assets/images/andrbell.png')}
                style={{
                  width: 250,
                  height: 200,
                  resizeMode: 'contain',
                  position: 'absolute',
                  bottom: 140,
                  right: -20,
                  zIndex: -1,
                }}
              />
            )}
            <Image
              source={require('../../assets/images/glyphEyeCatbg1.png')}
              style={{ position: 'absolute', bottom: -80, left: -30 }}
            />
            <Image
              source={require('../../assets/images/glyphEyeCatbg2.png')}
              style={{ position: 'absolute', bottom: -80, right: -30 }}
            />
          </View>

          <View style={{ gap: 14 }}>
            <GlyphEyeCraftButton
              btnText={'Play'}
              handleGlyphEyeBtnPress={() =>
                navigation.navigate('GlyphEyeCraftLevels')
              }
            />
            <GlyphEyeCraftButton
              btnText={'Library'}
              handleGlyphEyeBtnPress={() =>
                navigation.navigate('GlyphEyeLibrary')
              }
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  glyphEyeView: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 30,
  },
  isPressed: {
    transform: [{ translateY: 2 }],
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  glyphEyeTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#5C1B00',
    textAlign: 'center',
  },
  glyphEyeBtnTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#964B2B',
    textAlign: 'center',
  },
});

export default GlyphEyeCraftHome;
