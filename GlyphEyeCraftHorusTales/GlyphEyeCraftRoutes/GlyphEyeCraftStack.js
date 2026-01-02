import { createStackNavigator } from '@react-navigation/stack';
import GlyphEyeCraftIntroduce from '../GlyphEyeCraftScreens/GlyphEyeCraftIntroduce';
import GlyphEyeCraftHome from '../GlyphEyeCraftScreens/GlyphEyeCraftHome';
import GlyphEyeCraftAbout from '../GlyphEyeCraftScreens/GlyphEyeCraftAbout';
import GlyphEyeCraftSettings from '../GlyphEyeCraftScreens/GlyphEyeCraftSettings';
import GlyphEyeCraftGame from '../GlyphEyeCraftScreens/GlyphEyeCraftGame';
import GlyphEyeCraftLevels from '../GlyphEyeCraftScreens/GlyphEyeCraftLevels';
import GlyphEyeLibrary from '../GlyphEyeCraftScreens/GlyphEyeLibrary';
import GlyphEyeStoryDetail from '../GlyphEyeCraftScreens/GlyphEyeStoryDetail';
import GlyphEyeLibrarySection from '../GlyphEyeCraftScreens/GlyphEyeLibrarySection';
import GlyphEyeMyStories from '../GlyphEyeCraftScreens/GlyphEyeMyStories';
import GlyphEyeCraftLoader from '../GlyphEyeCraftComponents/GlyphEyeCraftLoader';

const Stack = createStackNavigator();

const GlyphEyeCraftStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="GlyphEyeCraftLoader"
        component={GlyphEyeCraftLoader}
      />
      <Stack.Screen
        name="GlyphEyeCraftIntroduce"
        component={GlyphEyeCraftIntroduce}
      />
      <Stack.Screen name="GlyphEyeCraftHome" component={GlyphEyeCraftHome} />
      <Stack.Screen name="GlyphEyeCraftAbout" component={GlyphEyeCraftAbout} />
      <Stack.Screen
        name="GlyphEyeCraftSettings"
        component={GlyphEyeCraftSettings}
      />
      <Stack.Screen name="GlyphEyeCraftGame" component={GlyphEyeCraftGame} />
      <Stack.Screen
        name="GlyphEyeCraftLevels"
        component={GlyphEyeCraftLevels}
      />
      <Stack.Screen name="GlyphEyeLibrary" component={GlyphEyeLibrary} />
      <Stack.Screen
        name="GlyphEyeStoryDetail"
        component={GlyphEyeStoryDetail}
      />
      <Stack.Screen
        name="GlyphEyeLibrarySection"
        component={GlyphEyeLibrarySection}
      />
      <Stack.Screen name="GlyphEyeMyStories" component={GlyphEyeMyStories} />
    </Stack.Navigator>
  );
};

export default GlyphEyeCraftStack;
