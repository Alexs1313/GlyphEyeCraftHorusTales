import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// locals
import { markPageCompleted } from '../glyphEyeCraftUtils';
import { glyphPages } from '../GlyphEyeCraftData/glyphPages';

glyphPages.forEach(page => {
  page.answers = page.answers.map(answer =>
    typeof answer === 'string' ? answer.toLowerCase() : answer,
  );
});

const GlyphEyeCraftQuiz = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const pageIndexParam = route.params?.pageIndex ?? 0;
  const startIndex = Math.max(
    0,
    Math.min(pageIndexParam, glyphPages.length - 1),
  );

  const [pageIndex, setPageIndex] = useState(startIndex);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [isWaiting, setIsWaiting] = useState(false);
  const inputGlyphRef = useRef(null);
  const scrollGlyphRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setMessages([]);

    setStatus('idle');

    setInput('');

    setIsWaiting(false);
  }, [pageIndex]);

  useEffect(() => {
    const glyphT = setTimeout(() => {
      scrollToGlyphChatEnd();
    }, 50);
    return () => clearTimeout(glyphT);
  }, [messages]);

  const currentP = glyphPages[pageIndex];
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const scrollToGlyphChatEnd = () => {
    if (
      scrollGlyphRef.current &&
      typeof scrollGlyphRef.current.scrollToEnd === 'function'
    ) {
      try {
        scrollGlyphRef.current.scrollToEnd({ animated: true });
      } catch (e) {
        console.log('error scrolling to end =>', e);
      }
    }
  };

  const submitAnswer = async () => {
    const trimmedAnsw = (input || '').trim();
    if (!trimmedAnsw || isWaiting) return;

    const userMsg = { type: 'user', text: trimmedAnsw };

    setMessages(message => [...message, userMsg]);

    setInput('');

    setIsWaiting(true);

    await delay(2000);

    const nrmlzdAnsw = trimmedAnsw.toLowerCase().replace(/\s+/g, ' ').trim();

    const isCorrectAnsw = currentP.answers.some(
      a => nrmlzdAnsw === a.toLowerCase().replace(/\s+/g, ' ').trim(),
    );

    if (isCorrectAnsw) {
      const sys = {
        type: 'system',
        text: currentP.successText,
        status: 'correct',
      };

      setMessages(m => [...m, sys]);

      setStatus('correct');

      anmtGlyphFeedback();
    } else {
      const sys = {
        type: 'system',

        text: currentP.failText,

        status: 'incorrect',
      };
      setMessages(m => [...m, sys]);

      setStatus('incorrect');

      anmtGlyphFeedback();

      await delay(300);

      const qMsg = { type: 'question', text: currentP.promptBottom };

      setMessages(m => [...m, qMsg]);
    }

    setIsWaiting(false);
    setTimeout(
      () => inputGlyphRef.current && inputGlyphRef.current.focus(),
      50,
    );
  };

  const anmtGlyphFeedback = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const onNextGlyphButtonPressed = async () => {
    try {
      await markPageCompleted(pageIndex + 1);
    } catch (err) {
      console.warn('Failed to save progress =>', err);
    }

    if (pageIndex < glyphPages.length - 1) {
      setPageIndex(prevP => prevP + 1);
    } else {
      navigation.navigate('GlyphEyeCraftLevels');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/glyphEyeSecBg.png')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
      <View style={{ flex: 1, paddingTop: 40, paddingBottom: 30 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
              resizeMode="contain"
              style={styles.glyphHdrCtr}
            >
              <Text style={styles.glyphHdrTitle}>Page {pageIndex + 1}</Text>
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

          <View style={styles.glyphMain}>
            <View style={styles.chatWrapper}>
              <ScrollView
                ref={scrollGlyphRef}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => scrollToGlyphChatEnd()}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.glyphPromptsContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 13,
                    }}
                  >
                    {Platform.OS === 'android' ? (
                      <Image
                        source={require('../../assets/images/andrbell.png')}
                        style={{ width: 100, height: 100 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={require('../../assets/images/glyphChatLogo.png')}
                      />
                    )}
                    <ImageBackground
                      source={require('../../assets/images/glyphgmBoard.png')}
                      resizeMode="stretch"
                      style={styles.glyphScrollCard}
                    >
                      <Text style={styles.glyphScrollText}>
                        {currentP.promptTop}
                      </Text>
                    </ImageBackground>
                  </View>

                  <ImageBackground
                    source={require('../../assets/images/glyphgmBoard.png')}
                    resizeMode="stretch"
                    style={[styles.glyphScrollCard, { marginTop: 10 }]}
                  >
                    <Text style={styles.glyphScrollText}>
                      {currentP.promptBottom}
                    </Text>
                  </ImageBackground>
                </View>

                {messages.length === 0 ? (
                  <View style={styles.hintBox} />
                ) : (
                  messages.map((message, i) => {
                    if (message.type === 'user') {
                      return (
                        <ImageBackground
                          key={`user-${i}`}
                          source={require('../../assets/images/glyphEyeHeader.png')}
                          resizeMode="stretch"
                          style={styles.glyphUserMessage}
                        >
                          <Text style={styles.glyphUserText}>
                            {message.text}
                          </Text>
                        </ImageBackground>
                      );
                    } else if (message.type === 'question') {
                      return (
                        <ImageBackground
                          key={`q-${i}`}
                          source={require('../../assets/images/glyphgmBoard.png')}
                          resizeMode="stretch"
                          style={styles.glyphQuestionMessage}
                        >
                          <Text style={[styles.glyphScrollText]}>
                            {message.text}
                          </Text>
                        </ImageBackground>
                      );
                    } else {
                      const correct = message.status === 'correct';
                      return (
                        <Animated.View
                          key={`sys-${i}`}
                          style={{ opacity: fadeAnim, alignSelf: 'flex-start' }}
                        >
                          <ImageBackground
                            source={
                              correct
                                ? require('../../assets/images/glyphCorrBoard.png')
                                : require('../../assets/images/glyphWrongBoard.png')
                            }
                            resizeMode="stretch"
                            style={styles.glyphSystemMessage}
                          >
                            <Text
                              style={[
                                styles.glyphSystemText,
                                correct
                                  ? { color: '#3B962B' }
                                  : { color: '#962B2B' },
                              ]}
                            >
                              {message.text}
                            </Text>
                          </ImageBackground>

                          {correct && (
                            <Image
                              source={require('../../assets/images/glyphCorrLogo.png')}
                              style={{ alignSelf: 'center', marginTop: 12 }}
                            />
                          )}
                        </Animated.View>
                      );
                    }
                  })
                )}
              </ScrollView>
            </View>
          </View>

          {status === 'correct' && (
            <TouchableOpacity onPress={onNextGlyphButtonPressed}>
              <ImageBackground
                resizeMode="stretch"
                style={styles.glyphNextBtn}
                source={require('../../assets/images/glyphEyeBtn.png')}
              >
                <Text style={styles.glyphNextBtnText}>Next</Text>
              </ImageBackground>
            </TouchableOpacity>
          )}

          {status !== 'correct' && (
            <View style={styles.glyphInputBar}>
              <TextInput
                ref={inputGlyphRef}
                value={input}
                onChangeText={setInput}
                placeholder="Type your answer..."
                placeholderTextColor="#FFFFFF80"
                style={[styles.glyphInput, isWaiting ? { opacity: 0.6 } : null]}
                onSubmitEditing={submitAnswer}
                returnKeyType="send"
                editable={!isWaiting}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.glyphSendBtn,
                  isWaiting ? { opacity: 0.6 } : null,
                  pressed && styles.isPressed,
                ]}
                onPress={submitAnswer}
                disabled={isWaiting}
              >
                <Image source={require('../../assets/images/glyphSend.png')} />
              </Pressable>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  glyphHdrWrp: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    paddingTop: 20,
    marginBottom: 12,
  },
  glyphHdrCtr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  glyphHdrTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
  glyphMain: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 12,
  },
  glyphPromptsContainer: {
    alignItems: 'flex-end',
  },
  glyphScrollCard: {
    width: 280,
    minHeight: 130,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    paddingVertical: 26,
  },
  glyphScrollText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#964B2B',
    textAlign: 'center',
  },
  glyphChatWrapper: {
    flex: 1,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  glyphChatContent: {
    paddingBottom: 12,
    paddingTop: 6,
  },
  glyphHintBox: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  glyphHintText: { color: '#d7b39a', fontFamily: 'Poppins-Medium' },
  glyphUserMessage: {
    padding: 10,
    width: 261,
    minHeight: 48,
    alignSelf: 'flex-end',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphUserText: {
    color: '#FFEAE1',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  glyphQuestionMessage: {
    padding: 12,
    width: 270,
    minHeight: 130,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 26,
  },
  isPressed: {
    transform: [{ translateY: 2 }],
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  glyphSystemMessage: {
    paddingVertical: 30,
    paddingHorizontal: 40,
    maxWidth: 270,
    minHeight: 130,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  glyphSystemText: {
    color: '#2b2b2b',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 16,
  },
  glyphNextBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 345,
    alignItems: 'center',
    justifyContent: 'center',
    height: 57,
    alignSelf: 'center',
  },
  glyphNextBtnText: {
    fontFamily: 'Poppins-Bold',
    color: '#964B2B',
    fontSize: 20,
  },
  glyphInputBar: {
    width: '88%',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    backgroundColor: 'transparent',
  },
  glyphInput: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#C28B64',
    borderRadius: 2,
    paddingHorizontal: 12,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  glyphSendBtn: {
    marginLeft: 8,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e6ab7f',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GlyphEyeCraftQuiz;
