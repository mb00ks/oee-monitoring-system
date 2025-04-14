import AnimatedNumber from "./AnimatedNumber"

type Props = {
    data: {
      availability: number
      performance: number
      quality: number
      oee: number
    }
  }
  
  export default function OeeCards({ data }: Props) {
    const items = [
      { label: "Availability", value: data.availability, emoji: "📈" },
      { label: "Performance", value: data.performance, emoji: "⚙️" },
      { label: "Quality", value: data.quality, emoji: "✅" },
      { label: "OEE", value: data.oee, emoji: "🌟" },
    ]
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => {
          // Warna dinamis berdasarkan nilai
          let color = "text-green-600"
          if (item.value < 70) color = "text-red-600"
          else if (item.value < 85) color = "text-yellow-500"

          return (
            <div
              key={item.label}              
              className="bg-white dark:bg-gray-800 border-l-4 p-5 rounded-lg shadow-lg border-gray-300 dark:border-gray-600 text-center transition"
            >
              <h2 className="text-md font-semibold mb-1 text-gray-600 dark:text-gray-300">
                {item.emoji} {item.label}
              </h2>
              <p className={`text-3xl font-bold ${color}`}>
                <AnimatedNumber value={item.value} /> %
              </p>
            </div>
          )
        })}
      </div>
    )
  }
  