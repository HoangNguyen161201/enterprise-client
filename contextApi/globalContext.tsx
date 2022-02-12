import { createContext } from 'react';

//Types
interface IGlobalConttextProps {
  children: any;
}

//Create context
const GlobalContext = createContext({});

//Context porvider function
function GlobalContextProvider({ children }: IGlobalConttextProps) {
  const value = {};

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export { GlobalContext, GlobalContextProvider };