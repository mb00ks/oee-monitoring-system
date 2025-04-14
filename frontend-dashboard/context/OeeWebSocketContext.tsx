import React, { createContext, useContext, useEffect, useRef, useState } from "react"

type OeeData = {
  availability: number
  performance: number
  quality: number
  oee: number
}

type OeeContextType = {
  oeeData: OeeData | null
  connected: boolean
}

const OeeWebSocketContext = createContext<OeeContextType>({
  oeeData: null,
  connected: false
})

export const useOeeWebSocket = () => useContext(OeeWebSocketContext)

export const OeeWebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [oeeData, setOeeData] = useState<OeeData | null>(null)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const WS_BASE = process.env.NEXT_PUBLIC_API_URL_WS || "ws://localhost:8000"

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/oee`)
    socketRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      console.log("✅ Global OEE WebSocket connected")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setOeeData(data)
    }

    ws.onclose = () => {
      setConnected(false)
      console.warn("Global OEE WebSocket disconnected")
    }

    ws.onerror = () => {
      ws.close()
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <OeeWebSocketContext.Provider value={{ oeeData, connected }}>
      {children}
    </OeeWebSocketContext.Provider>
  )
}
