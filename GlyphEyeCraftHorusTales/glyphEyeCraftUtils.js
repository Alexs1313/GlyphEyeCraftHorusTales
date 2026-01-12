import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultProgress = {
  highestUnlocked: 1,
  completed: [],
};

const cloneProgress = glyphP => ({
  highestUnlocked: Number.isFinite(glyphP?.highestUnlocked)
    ? glyphP.highestUnlocked
    : 1,

  completed: Array.isArray(glyphP?.completed)
    ? [
        ...new Set(
          glyphP.completed
            .map(Number)
            .filter(n => Number.isFinite(n) && n >= 1),
        ),
      ].sort((glyphA, glyphB) => glyphA - glyphB)
    : [],
});

const readProgress = async () => {
  try {
    const svdRwPr = await AsyncStorage.getItem('GlyphEyeProgress_v1');

    if (!svdRwPr) return cloneProgress(defaultProgress);

    const parsedJSON = JSON.parse(svdRwPr);

    return cloneProgress(parsedJSON);
  } catch (err) {
    console.warn('error =>', err);

    return cloneProgress(defaultProgress);
  }
};

const writeProgress = async glphProgress => {
  try {
    const toGlphWrite = cloneProgress(glphProgress);

    await AsyncStorage.setItem(
      'GlyphEyeProgress_v1',
      JSON.stringify(toGlphWrite),
    );

    return true;
  } catch (err) {
    console.warn('error =>', err);
    return false;
  }
};

export const getProgress = async () => {
  return await readProgress();
};

export const markPageCompleted = async pageNumber => {
  if (!Number.isFinite(pageNumber) || pageNumber < 1) return null;

  const glphPrg = await readProgress();

  const completedSet = new Set(glphPrg.completed);

  completedSet.add(Number(pageNumber));

  const completedArr = [...completedSet]
    .filter(n => Number.isFinite(n))
    .sort((glyphA, glyphB) => glyphA - glyphB);

  const nextGlphUnlocked = Math.max(
    glphPrg.highestUnlocked || 1,
    pageNumber + 1,
  );

  const newProgress = {
    highestUnlocked: nextGlphUnlocked,
    completed: completedArr,
  };

  await writeProgress(newProgress);

  return newProgress;
};

export const setHighestUnlocked = async pageNumber => {
  if (!Number.isFinite(pageNumber) || pageNumber < 1) return null;

  const glphPrg = await readProgress();

  const newGlphProgress = {
    ...glphPrg,
    highestUnlocked: Number(pageNumber),
  };

  await writeProgress(newGlphProgress);
  return newGlphProgress;
};

export const resetProgress = async () => {
  await writeProgress(defaultProgress);
  return cloneProgress(defaultProgress);
};

// Glyph Stories

const isGlphClone = v => JSON.parse(JSON.stringify(v));

export const getAllStories = async () => {
  try {
    const glphRw = await AsyncStorage.getItem('GlyphEyeStories_v1');

    if (!glphRw) return null;

    return JSON.parse(glphRw);
  } catch (err) {
    console.warn('error =>', err);
    return null;
  }
};

export const saveAllStories = async storiesArr => {
  try {
    await AsyncStorage.setItem(
      'GlyphEyeStories_v1',
      JSON.stringify(storiesArr),
    );

    return true;
  } catch (err) {
    console.warn('error =>', err);
    return false;
  }
};

export const ensureInitialStories = async initialStories => {
  const isGlphEx = await getAllStories();

  if (!isGlphEx || !Array.isArray(isGlphEx) || isGlphEx.length === 0) {
    const toGlphWrite = initialStories.map(story => ({
      ...story,
      section: story.section || 'all',
    }));
    await saveAllStories(toGlphWrite);
    return toGlphWrite;
  }
  return isGlphEx;
};

export const setStorySection = async (storyId, section) => {
  if (!storyId || !section) return null;

  const svdStrs = (await getAllStories()) || [];

  const idxGlph = svdStrs.findIndex(storyGl => storyGl.id === storyId);

  if (idxGlph === -1) return null;

  const newGlphStories = isGlphClone(svdStrs);

  newGlphStories[idxGlph].section = section;

  await saveAllStories(newGlphStories);

  return newGlphStories[idxGlph];
};

export const addStory = async glStory => {
  if (!glStory || !glStory.id) return null;

  const svdStrs = (await getAllStories()) || [];
  const exists = svdStrs.find(storyGl => storyGl.id === glStory.id);
  if (exists) return exists;
  const newGlphStories = [
    ...svdStrs,
    { ...glStory, section: glStory.section || 'all' },
  ];
  await saveAllStories(newGlphStories);

  return newGlphStories.find(storyGl => storyGl.id === glStory.id);
};

export const resetStories = async initialStories => {
  const toGlphWrite = initialStories.map(storyGl => ({
    ...storyGl,
    section: storyGl.section || 'all',
  }));
  await saveAllStories(toGlphWrite);
  return toGlphWrite;
};

// Glyph Stories Utils

const isGlyphClone = v => JSON.parse(JSON.stringify(v));

export const getAllGlyphStories = async () => {
  try {
    const glphRaw = await AsyncStorage.getItem('GlyphEyeStoriesSaved');

    if (!glphRaw) return [];

    const parsedJSON = JSON.parse(glphRaw);

    if (!Array.isArray(parsedJSON)) return [];

    return parsedJSON;
  } catch (err) {
    console.warn('error =>', err);
    return [];
  }
};

export const saveAllGlyphStories = async stories => {
  try {
    await AsyncStorage.setItem('GlyphEyeStoriesSaved', JSON.stringify(stories));

    return true;
  } catch (err) {
    console.warn('error =>', err);

    return false;
  }
};

export const ensureInitialGlyphStories = async (initialStories = []) => {
  try {
    const isExst = await getAllGlyphStories();
    if (!isExst || isExst.length === 0) {
      const toGlphWrite = initialStories.map(storyGl => ({
        ...storyGl,
        section: storyGl.section || 'all',
      }));
      await saveAllGlyphStories(toGlphWrite);
      return toGlphWrite;
    }
    return isExst;
  } catch (err) {
    console.warn('error =>', err);
    return [];
  }
};

export const addGlyphStory = async story => {
  if (!story || !story.id) return null;
  try {
    const allStrsGlph = (await getAllGlyphStories()) || [];

    const isExs = allStrsGlph.find(storyGl => storyGl.id === story.id);

    if (isExs) return isExs;

    const newGlphStories = [
      ...allStrsGlph,
      { ...story, section: story.section || 'all' },
    ];

    await saveAllGlyphStories(newGlphStories);

    return newGlphStories.find(s => s.id === story.id);
  } catch (err) {
    console.warn('error =>', err);
    return null;
  }
};

export const deleteGlyphStory = async storyId => {
  if (!storyId) return false;
  try {
    const allStrsGlph = (await getAllGlyphStories()) || [];

    const filteredGlph = allStrsGlph.filter(storyGl => storyGl.id !== storyId);

    await saveAllGlyphStories(filteredGlph);
    return true;
  } catch (err) {
    console.warn('error =>', err);
    return false;
  }
};

export const setGlyphStorySection = async (storyId, section) => {
  if (!storyId || !section) return null;
  try {
    const allStrsGlph = (await getAllGlyphStories()) || [];

    const idxGlph = allStrsGlph.findIndex(storyGl => storyGl.id === storyId);

    if (idxGlph === -1) return null;

    const newGlphStories = isGlyphClone(allStrsGlph);

    newGlphStories[idxGlph].section = section;
    await saveAllGlyphStories(newGlphStories);

    return newGlphStories[idxGlph];
  } catch (err) {
    console.warn('error =>', err);
    return null;
  }
};

const USER_STORIES_KEY = 'GlyphEyeUserStories_v1';

export const getUserStories = async () => {
  try {
    const raw = await AsyncStorage.getItem(USER_STORIES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('getUserStories error =>', err);
    return [];
  }
};

export const saveUserStories = async stories => {
  try {
    await AsyncStorage.setItem(USER_STORIES_KEY, JSON.stringify(stories));
    return true;
  } catch (err) {
    console.warn('saveUserStories error =>', err);
    return false;
  }
};

export const addUserStory = async story => {
  if (!story || !story.id) return null;

  const existing = await getUserStories();
  const updated = [story, ...existing];

  await saveUserStories(updated);
  return story;
};

export const deleteUserStory = async storyId => {
  if (!storyId) return false;

  const existing = await getUserStories();
  const filtered = existing.filter(s => s.id !== storyId);

  await saveUserStories(filtered);
  return true;
};
