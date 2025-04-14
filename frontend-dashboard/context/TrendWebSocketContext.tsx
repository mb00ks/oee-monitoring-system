import React, { createContext, useContext, useEffect, useRef, useState } from "react"

type TrendItem = {
  label: string
  availability: number
  performance: number
  quality: number
  oee: number
}

type TrendContextType = {
  trendData: TrendItem[]
  connected: boolean
  setGroupBy: (value: 'day' | 'hour' | 'minute' | 'shift') => void
  groupBy: 'day' | 'hour' | 'minute' | 'shift'
}

const TrendWebSocketContext = createContext<TrendContextType>({
  trendData: [],
  connected: false,
  setGroupBy: () => {},
  groupBy: 'day',
})

export const useTrendWebSocket = () => useContext(TrendWebSocketContext)

export const TrendWebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [trendData, setTrendData] = useState<TrendItem[]>([])
  const [connected, setConnected] = useState(false)
  const [groupBy, setGroupBy] = useState<'day' | 'hour' | 'minute' | 'shift'>('day')

  const socketRef = useRef<WebSocket | null>(null)
  const WS_BASE = process.env.NEXT_PUBLIC_API_URL_WS || "ws://localhost:8000"

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close()
    }

    const ws = new WebSocket(`${WS_BASE}/ws/oee/trend?group_by=${groupBy}`)
    socketRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      console.log(`✅ WebSocket Trend (${groupBy}) connected`)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setTrendData(data)
    }

    ws.onclose = () => {
      setConnected(false)
      console.warn(`⚠️ WebSocket Trend (${groupBy}) disconnected`)
    }

    ws.onerror = () => {
      ws.close()
    }

    return () => {
      ws.close()
    }
  }, [groupBy])

  return (
    <TrendWebSocketContext.Provider value={{ trendData, connected, setGroupBy, groupBy }}>
      {children}
    </TrendWebSocketContext.Provider>
  )
}
