import { React, createContext } from "react";

const Files = createContext();

const context = ({ children }) => {
  return <Files.Provider>{children}</Files.Provider>;
};

export default context;
