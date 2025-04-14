import { useEffect, useState } from "react"

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  // Saat komponen mount: ambil preferensi dari localStorage (jika ada)
  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Saat darkMode berubah: update ke <html> dan simpan
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-3 py-1 text-sm border rounded-md dark:bg-gray-700 dark:text-white text-gray-800 hover:shadow-md transition"
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  )
}
