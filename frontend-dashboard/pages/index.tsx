import axios from 'axios'
import { useEffect, useState } from 'react'
import OeeCards from '../components/OeeCards'
import TrendChart from '../components/TrendChart'

export default function Home() {
  const [oeeData, setOeeData] = useState(null)
  const [trendData, setTrendData] = useState([])
  const [groupBy, setGroupBy] = useState<'day' | 'hour' | 'shift'>('day')

  useEffect(() => {
    const fetchOee = async () => {
      const res = await axios.get('http://localhost:8000/oee')
      setOeeData(res.data)
    }
    const fetchTrend = async () => {
      const res = await axios.get(`http://localhost:8000/oee/trend?group_by=${groupBy}`)
      setTrendData(res.data)
    }
    fetchOee()
    fetchTrend()
    const interval = setInterval(fetchOee, 5000)
    return () => clearInterval(interval)
  }, [groupBy])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Realtime OEE Monitoring</h1>
      {oeeData && <OeeCards data={oeeData} />}
      <div className="mt-10">
        <label className="mr-3">Lihat tren berdasarkan:</label>
        <select value={groupBy} onChange={e => setGroupBy(e.target.value as any)} className="border p-1">
          <option value="day">Day</option>
          <option value="hour">Hour</option>
          <option value="shift">Shift</option>
        </select>
        <TrendChart data={trendData} />
      </div>
    </div>
  )
}
