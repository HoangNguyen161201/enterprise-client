import { ReactElement, ReactNode } from "react";
import { NextPage } from 'next'
import { AppProps } from "next/app";

// Custom type for layout

export type NextLayout = NextPage<{
    children: ReactElement 
}>

export type NextPageWithLayout = NextPage<any> & {
    getLayout?: NextLayout
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}