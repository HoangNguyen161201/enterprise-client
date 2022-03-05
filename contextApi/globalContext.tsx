import { createContext, ReactElement, ReactNode, useEffect, useState } from 'react';
import { getCurrentUser } from 'queries/auth';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { NextPage } from 'next';
import io, { Socket } from 'socket.io-client';
import { ConfigProvider } from 'antd';
import { IBreadCrumb, IMainBreadc } from 'models/elementType';

//Types
interface DefaultEventsMap {
  [event: string]: (...args: any[]) => void;
}

interface IGlobalConttextProps {
  children: ReactNode | ReactElement | NextPage;
}

interface IGlobalContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
  darkMode: boolean
  toggleDarkMode?: any
  color: string,
  color2: string
  bgColor: string
  desColor: string  
}

//Create context
const GlobalContext = createContext<IGlobalContext>({
  socket: null,
  darkMode: false,
  color: 'color-2',
  bgColor: 'bg-2',
  color2: 'color-5',
  desColor: 'des-1'
});

//Context provider function
function GlobalContextProvider({ children }: IGlobalConttextProps) {
  const { refetch } = getCurrentUser();
  const { push, route } = useRouter();

  // darkmode
  const [darkMode, setDarkModel] = useState(false)
  const [color, setColor] = useState('color-2')
  const [color2, setColor2] = useState('color-5')
  const [bgColor, setBgColor] = useState('bg-2')
  const [desColor, setDesColor] = useState('des-1')

  // toggleDarkMode
  const toggleDarkMode = ()=> {
    setDarkModel(!darkMode)
  }

  //State socket
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  //Refetch get current user
  useEffect(() => {
    const firstLogin = localStorage.getItem('first-login');
    if (firstLogin === 'true') {
      refetch();
    }
  }, []);

    // set darkMode
    useEffect(() => {
      if(darkMode) {
        setColor('color-5')
        setColor2('color-2')
        setBgColor('bg-1')
        setDesColor('des-2')
        ConfigProvider.config({
          theme: {
            primaryColor: '#CDFFEB',
          },
        });
      } else {
        setColor('color-2')
        setBgColor('bg-2')
        setColor2('color-5')
        setDesColor('des-1')
        ConfigProvider.config({
          theme: {
            primaryColor: '#009F9D',
          },
        });
      }
    }, [darkMode]);


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
    darkMode,
    toggleDarkMode,
    color,
    color2,
    bgColor,
    desColor,
  };

  return (
    <GlobalContext.Provider value={value}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          style={{
            overflowX: 'hidden',
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
