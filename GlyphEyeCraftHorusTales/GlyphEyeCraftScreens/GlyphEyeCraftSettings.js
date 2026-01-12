import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useGlyphEyeStore } from '../GlyphEyeCraftStore/glyphEyeCraftCntxt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const GlyphEyeCraftSettings = () => {
  const navigation = useNavigation();
  const {
    glyphEyeNotificationsEnabled,
    setGlyphEyeNotificationsEnabled,
    glyphEyeSoundEnabled,
    setGlyphEyeSoundEnabled,
  } = useGlyphEyeStore();

  const toggleNotifications = async selectedValue => {
    Toast.show({
      text1: !glyphEyeNotificationsEnabled
        ? 'Notifications turned on!'
        : 'Notifications turned off!',
    });

    try {
      await AsyncStorage.setItem(
        'toggleNotifications',
        JSON.stringify(selectedValue),
      );
      setGlyphEyeNotificationsEnabled(selectedValue);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const toggleSound = async selectedValue => {
    glyphEyeNotificationsEnabled &&
      Toast.show({
        text1: !glyphEyeSoundEnabled
          ? 'Background music turned on!'
          : 'Background music turned off!',
      });

    try {
      await AsyncStorage.setItem('toggleSound', JSON.stringify(selectedValue));

      setGlyphEyeSoundEnabled(selectedValue);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress?',
      'This will clear your reading statuses, puzzle history, and streaks. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('GlyphEyeProgress_v1');

              Toast.show({
                type: 'success',
                text1: 'Progress has been reset!',
              });
            } catch (err) {
              console.warn('Failed to reset progress', err);
            }
          },
        },
      ],
    );
  };

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
              <Text style={styles.glyphEyeHeaderTitle}>Settings</Text>
            </ImageBackground>
          </View>

          <View
            style={{
              marginTop: 30,
              width: '100%',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View style={styles.glyphEyeSettBox}>
              <Text style={styles.glyphEyeSettBoxText}>Notifications</Text>
              <Switch
                thumbColor={'#fff'}
                trackColor={{ false: '#767577', true: '#AA2C2D' }}
                value={glyphEyeNotificationsEnabled}
                onValueChange={toggleNotifications}
              />
            </View>
            {Platform.OS === 'ios' && (
              <View style={styles.glyphEyeSettBox}>
                <Text style={styles.glyphEyeSettBoxText}>Background music</Text>
                <Switch
                  thumbColor={'#fff'}
                  trackColor={{ false: '#767577', true: '#AA2C2D' }}
                  value={glyphEyeSoundEnabled}
                  onValueChange={toggleSound}
                />
              </View>
            )}

            <Pressable
              style={styles.glyphEyeSettBox}
              onPress={handleResetProgress}
            >
              <Text style={styles.glyphEyeSettBoxText}>Reset progress</Text>
            </Pressable>
            {Platform.OS === 'ios' && (
              <Pressable
                style={styles.glyphEyeSettBox}
                onPress={() =>
                  Linking.openURL(
                    'https://www.termsfeed.com/live/144cbaeb-43b7-44a0-be23-3e6d5b15154c',
                  )
                }
              >
                <Text style={styles.glyphEyeSettBoxText}>Terms of use</Text>
              </Pressable>
            )}
          </View>
        </View>

        {Platform.OS === 'android' && (
          <Image
            source={require('../../assets/images/andrbell.png')}
            style={{
              width: 250,
              height: 200,
              resizeMode: 'contain',
              position: 'absolute',
              bottom: 40,
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
  glyphEyeSettBox: {
    width: '90%',
    minHeight: 56,
    backgroundColor: '#C28B64',
    borderRadius: 2,
    paddingHorizontal: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  glyphEyeSettBoxText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFEAE1',
  },
});

export default GlyphEyeCraftSettings;
