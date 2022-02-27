import { createContext, useEffect } from 'react';
import { getCurrentUser } from 'queries/auth';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

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
  const { push, route } = useRouter();
  useEffect(() => {
    const firstLogin = localStorage.getItem('first-login');
    if (firstLogin === 'true') {
      refetch();
    }
  }, []);

  return (
    <GlobalContext.Provider value={value}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          style={{
            overflowX: 'hidden'
          }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          key={route}
          initial={{ opacity: 0, y: -50 }}
          exit={{ opacity: 0, x: 250, transition: { duration: 0.7 } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalContextProvider };
