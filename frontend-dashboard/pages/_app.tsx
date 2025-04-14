import "@/styles/globals.css";
import type { AppProps } from 'next/app'
import { OeeWebSocketProvider } from '../context/OeeWebSocketContext'
import { TrendWebSocketProvider } from '../context/TrendWebSocketContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OeeWebSocketProvider>
      <TrendWebSocketProvider>
        <Component {...pageProps} />
      </TrendWebSocketProvider>
    </OeeWebSocketProvider>
  )
}
