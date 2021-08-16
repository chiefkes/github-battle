import React from "react";

const ThemeContext = React.createContext(null);

export default ThemeContext;
export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;
