import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
  import { Line, Bar } from 'react-chartjs-2'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  )
  
  type Props = {
    data: {
      label: string
      availability: number
      performance: number
      quality: number
      oee: number
    }[]
  }
  
  export default function TrendChart({ data }: Props) {
    if (!data.length) return null
  
    const labels = data.map(d => d.label)
    const oeeData = data.map(d => d.oee)
    const a = data.map(d => d.availability)
    const p = data.map(d => d.performance)
    const q = data.map(d => d.quality)
  
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">🌐 Tren OEE</h2>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "OEE",
                data: oeeData,
                fill: false,
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgb(34, 197, 94)",
              },
            ],
          }}
        />
  
        <h2 className="text-xl font-semibold mt-6 mb-2">📊 Komponen OEE</h2>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Availability",
                data: a,
                backgroundColor: "rgb(59, 130, 246)",
              },
              {
                label: "Performance",
                data: p,
                backgroundColor: "rgb(251, 191, 36)",
              },
              {
                label: "Quality",
                data: q,
                backgroundColor: "rgb(244, 63, 94)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
            },
          }}
        />
      </div>
    )
  }
  