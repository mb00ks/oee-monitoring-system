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
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-white shadow-md p-4 rounded border border-gray-200 text-center"
          >
            <h2 className="text-lg font-semibold mb-1">{item.emoji} {item.label}</h2>
            <p className="text-2xl font-bold text-blue-600">{item.value} %</p>
          </div>
        ))}
      </div>
    )
  }
  