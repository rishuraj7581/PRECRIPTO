import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const value = {};
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
// This file creates a context for the application, allowing components to share state and functions.
// The `AppContextProvider` component wraps its children with the `AppContext.Provider`, providing a context value that can be accessed by any child component.
// This is useful for managing global state or functions that need to be accessed by multiple components in the application.
