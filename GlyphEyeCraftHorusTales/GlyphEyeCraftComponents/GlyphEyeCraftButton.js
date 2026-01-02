import { ImageBackground, Pressable, StyleSheet, Text } from 'react-native';

const GlyphEyeCraftButton = ({ btnText, handleGlyphEyeBtnPress }) => {
  return (
    <Pressable
      onPress={handleGlyphEyeBtnPress}
      style={({ pressed }) => [pressed && styles.isPressed]}
    >
      <ImageBackground
        source={require('../../assets/images/glyphEyeBtn.png')}
        resizeMode="contain"
        style={styles.glyphEyeBtn}
      >
        <Text style={styles.glyphEyeBtnTitle}>{btnText}</Text>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  glyphEyeBtnTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#964B2B',
    textAlign: 'center',
  },
  isPressed: {
    transform: [{ translateY: 2 }],
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  glyphEyeBtn: {
    width: 345,
    height: 57,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GlyphEyeCraftButton;
