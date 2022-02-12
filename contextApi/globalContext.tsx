import { createContext, useEffect } from 'react';
import { getCurrentUser } from '../queries';
import { useRouter } from 'next/router';

//Types
interface IGlobalConttextProps {
  children: any;
}

//Create context
const GlobalContext = createContext({});

//Context provider function
function GlobalContextProvider({ children }: IGlobalConttextProps) {
  const { refetch } = getCurrentUser();
  const value = {};
  const {push} = useRouter()
  useEffect(() => {
    const firstLogin = localStorage.getItem('first-login');
    if (firstLogin === 'true') {
      console.log('nguyen quanghoa');
      refetch();
      push('/', undefined, {
          shallow: true
      })
    }
  }, []);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export { GlobalContext, GlobalContextProvider };
