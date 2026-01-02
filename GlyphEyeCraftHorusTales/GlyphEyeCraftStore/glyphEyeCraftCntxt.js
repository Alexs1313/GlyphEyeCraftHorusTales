import React, { createContext, useContext, useState } from 'react';

export const StoreContext = createContext(undefined);

export const useGlyphEyeStore = () => {
  return useContext(StoreContext);
};

export const StoreProvider = ({ children }) => {
  const [glyphEyeNotificationsEnabled, setGlyphEyeNotificationsEnabled] =
    useState(false);
  const [glyphEyeSoundEnabled, setGlyphEyeSoundEnabled] = useState(false);

  const contextValues = {
    glyphEyeNotificationsEnabled,
    setGlyphEyeNotificationsEnabled,
    glyphEyeSoundEnabled,
    setGlyphEyeSoundEnabled,
  };

  return (
    <StoreContext.Provider value={contextValues}>
      {children}
    </StoreContext.Provider>
  );
};
