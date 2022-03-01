import { createContext, ReactElement, ReactNode, useEffect, useState } from 'react';
import { getCurrentUser } from 'queries/auth';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { NextPage } from 'next';
import io, { Socket } from 'socket.io-client';

//Types
interface DefaultEventsMap {
  [event: string]: (...args: any[]) => void;
}

interface IGlobalConttextProps {
  children: ReactNode | ReactElement | NextPage;
}

interface IGlobalContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

//Create context
const GlobalContext = createContext<IGlobalContext>({
  socket: null,
});

//Context provider function
function GlobalContextProvider({ children }: IGlobalConttextProps) {
  const { refetch } = getCurrentUser();
  const { push, route } = useRouter();

  //State socket
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  //Refetch get current user
  useEffect(() => {
    const firstLogin = localStorage.getItem('first-login');
    if (firstLogin === 'true') {
      refetch();
    }
  }, []);

  //Setting socket
  useEffect(() => {
    const socketIo = io(process.env.API_URL as string);
    socketIo.emit('connection');
    setSocket(socketIo);

    function cleanup() {
      socketIo.disconnect();
    }

    return cleanup;
  }, []);

  const value = {
    socket,
  };

  return (
    <GlobalContext.Provider value={value}>
      {/* <AnimatePresence exitBeforeEnter>
        <motion.div
          style={{
            overflowX: 'hidden',
          }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          key={route}
          initial={{ opacity: 0, y: -50 }}
          exit={{ opacity: 0, x: 250, transition: { duration: 0.7 } }}
        > */}
          {children}
        {/* </motion.div>
      </AnimatePresence> */}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalContextProvider };
