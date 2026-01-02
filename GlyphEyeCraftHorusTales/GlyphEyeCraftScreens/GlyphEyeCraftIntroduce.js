import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GlyphEyeCraftButton from '../GlyphEyeCraftComponents/GlyphEyeCraftButton';

const glyphEyeIntroData = [
  {
    glyphEyeImg: require('../../assets/images/glyphEyeOn1.png'),
    glyphEyeBtn: 'Continue',
    glyphEyeTitle:
      'Enter a calm world of stories and light. Here, every word you read, write, or discover becomes part of an ancient rhythm waiting to be remembered',
  },
  {
    glyphEyeImg: require('../../assets/images/glyphEyeOn2.png'),
    glyphEyeBtn: 'Continue',
    glyphEyeTitle:
      'Challenge yourself with short riddles drawn from Egyptian lore. Each answer reveals a fragment of the past',
  },
  {
    glyphEyeImg: require('../../assets/images/glyphEyeOn3.png'),
    glyphEyeBtn: 'Start',
    glyphEyeTitle:
      'Read ancient tales or write your own. Mark them as Read, Reading, or Plan to Read',
  },
];

const GlyphEyeCraftIntroduce = () => {
  const [currentGlyphEyeIndex, setCurrentGlyphEyeIndex] = useState(0);
  const navigation = useNavigation();

  const handleGlyphEyeBtnPress = () => {
    currentGlyphEyeIndex < 2
      ? setCurrentGlyphEyeIndex(prevIdx => prevIdx + 1)
      : navigation.navigate('GlyphEyeCraftHome');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/introBg.png')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glyphEyeView}>
          <Image
            source={glyphEyeIntroData[currentGlyphEyeIndex].glyphEyeImg}
            style={{ top: 3 }}
          />
          <ImageBackground
            resizeMode="contain"
            source={require('../../assets/images/glyphEyeBoard.png')}
            style={{
              width: 346,
              height: 230,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <View style={{ paddingHorizontal: 40 }}>
              <Text style={styles.glyphEyeTitle}>
                {glyphEyeIntroData[currentGlyphEyeIndex].glyphEyeTitle}
              </Text>
            </View>
          </ImageBackground>

          <GlyphEyeCraftButton
            btnText={glyphEyeIntroData[currentGlyphEyeIndex].glyphEyeBtn}
            handleGlyphEyeBtnPress={handleGlyphEyeBtnPress}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  glyphEyeView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  glyphEyeTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#5C1B00',
    textAlign: 'center',
  },
});

export default GlyphEyeCraftIntroduce;
