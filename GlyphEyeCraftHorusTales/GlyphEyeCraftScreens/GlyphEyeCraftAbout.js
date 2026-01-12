import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const GlyphEyeCraftAbout = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/images/glyphEyeSecBg.png')}
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
              width: '95%',
              paddingHorizontal: 10,
            }}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [pressed && styles.isPressed]}
            >
              <Image source={require('../../assets/images/glyphEyeBack.png')} />
            </Pressable>

            <ImageBackground
              source={require('../../assets/images/glyphEyeHeader.png')}
              resizeMode="contain"
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.glyphEyeHeaderTitle}>About</Text>
            </ImageBackground>
          </View>

          <ImageBackground
            source={require('../../assets/images/glyphEyeAboutBox.png')}
            resizeMode="contain"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 346,
              height: 565,
              marginTop: 30,
              paddingHorizontal: 20,
            }}
          >
            <Text style={styles.glyphEyeAboutText}>
              {`Ey Ot |Morrsu: craft tales invites you into a world where stories, memory, and ancient wisdom intertwine. 

Each session reveals fragments of Egypt’s timeless myths — moments where gods, stars, and people share the same horizon. 
As you explore, you’ll test your knowledge, uncover relics of forgotten lore, and feel the calm rhythm of discovery that guided the scribes and dreamers of old.

The Eye of Horus watches your progress. Every correct answer brightens its light; every mistake dims it — but the sands always allow another chance.`}
            </Text>
          </ImageBackground>
        </View>
        {Platform.OS === 'android' && (
          <Image
            source={require('../../assets/images/cher.png')}
            style={{
              width: 250,
              height: 200,
              resizeMode: 'contain',
              position: 'absolute',
              bottom: 0,
              right: -20,
              zIndex: -1,
            }}
          />
        )}
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
  glyphEyeHeaderTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  glyphEyeAboutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#5C1B00',
    textAlign: 'center',
    padding: 20,
  },
  isPressed: {
    transform: [{ translateY: 2 }],
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
  },
});

export default GlyphEyeCraftAbout;
