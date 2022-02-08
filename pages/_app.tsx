import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ConfigProvider} from 'antd'
import { useEffect } from 'react'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {

  // custom color button
  useEffect(()=> {
    ConfigProvider.config({
      theme: {
        primaryColor: '#009F9D',
        infoColor: 'black'
      },
    })
  },[])
  return (
    <>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet"/>
        </Head>
        <Component {...pageProps} />
    </>
  ) 
}

export default MyApp
