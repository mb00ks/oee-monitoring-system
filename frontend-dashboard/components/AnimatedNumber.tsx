import { useEffect, useState } from "react"

export default function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 800
    const stepTime = Math.max(Math.floor(duration / value), 20)

    const timer = setInterval(() => {
      start += 1
      setDisplayValue(parseFloat((start * (value / 100)).toFixed(2)) * 100)
      if (start >= 100) {
        clearInterval(timer)
        setDisplayValue(value)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return <span>{displayValue.toFixed(2)}</span>
}
