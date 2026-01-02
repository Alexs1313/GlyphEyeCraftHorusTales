import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  View,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';

const GlyphEyeCraftLoader = () => {
  const bounceGlyphAnim = useRef(new Animated.Value(0)).current;
  const navigataTo = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigataTo.navigate('GlyphEyeCraftIntroduce');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceGlyphAnim, {
          toValue: -160,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceGlyphAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    anim.start();
    return () => anim.stop();
  }, [bounceGlyphAnim]);

  return (
    <ImageBackground
      source={require('../../assets/images/glyphEyeLoaderBg.png')}
      style={styles.glyphBg}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glyphBox}>
          <Animated.Image
            source={require('../../assets/images/glyphEyeCraftLoaderBook.png')}
            style={[
              styles.book,
              { transform: [{ translateY: bounceGlyphAnim }] },
            ]}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/images/glyphEyeCraftLoaderLogo.png')}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  glyphBg: { flex: 1 },
  glyphBox: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
    gap: 30,
  },
});

export default GlyphEyeCraftLoader;
