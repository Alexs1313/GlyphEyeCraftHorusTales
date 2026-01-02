import { NavigationContainer } from '@react-navigation/native';
import { StoreProvider } from './GlyphEyeCraftHorusTales/GlyphEyeCraftStore/glyphEyeCraftCntxt';
import GlyphEyeCraftStack from './GlyphEyeCraftHorusTales/GlyphEyeCraftRoutes/GlyphEyeCraftStack';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <NavigationContainer>
      <StoreProvider>
        <GlyphEyeCraftStack />
        <Toast position="top" topOffset={40} />
      </StoreProvider>
    </NavigationContainer>
  );
};

export default App;
