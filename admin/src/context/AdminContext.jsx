import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    aToken,
    setAToken,
    backendUrl,
    // Add other admin-related state and functions here
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
// This file creates a context for the application, allowing components to share state and functions.
// The `AppContextProvider` component wraps its children with the `AppContext.Provider`, providing a context value that can be accessed by any child component.
// This is useful for managing global state or functions that need to be accessed by multiple components in the application.
