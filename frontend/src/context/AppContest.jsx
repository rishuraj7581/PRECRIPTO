import { createContext } from "react";
import { doctors } from "../assets/assets";

export const AppContest = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";

  const value = {
    doctors,
    currencySymbol,
  };

  return (
    <AppContest.Provider value={value}>{props.children}</AppContest.Provider>
  );
};

export default AppContextProvider;
