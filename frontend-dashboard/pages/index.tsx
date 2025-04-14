import axios from 'axios'
import { useState } from 'react'
import OeeCards from '../components/OeeCards'
import TrendChart from '../components/TrendChart'
import DarkModeToggle from "../components/DarkModeToggle"
import { useOeeWebSocket } from '../context/OeeWebSocketContext'
import { useTrendWebSocket } from '../context/TrendWebSocketContext'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const { oeeData, connected: oeeConnected } = useOeeWebSocket()
  const { trendData, connected: trendConnected, groupBy, setGroupBy } = useTrendWebSocket()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">        
        <h1 className="text-2xl font-bold mb-4">📊 Realtime OEE Monitoring</h1>
        <DarkModeToggle />
        <div className="text-sm">
          OEE: {oeeConnected ? <span className="text-green-600">Connected</span> : <span className="text-red-600">Disconnected</span>} | 
          Trend: {trendConnected ? <span className="text-green-600">Connected</span> : <span className="text-red-600">Disconnected</span>}
        </div>
      </div>
      
      {oeeData && <OeeCards data={oeeData} />}
      
      <div className="mt-10">
        <label htmlFor="groupBy" className="mr-3 text-sm font-medium">Lihat tren berdasarkan:</label>
        <select value={groupBy} onChange={e => setGroupBy(e.target.value as any)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
          <option value="day">Day</option>
          <option value="hour">Hour</option>
          <option value="minute">Minute</option>
          <option value="shift">Shift</option>
        </select>
        <TrendChart data={trendData} />
      </div>
    </div>
  )
}
