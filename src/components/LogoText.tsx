'use client'

import { useState, useEffect } from 'react'

const rotatingWords = [
  '.Digital',
  '.AI',
  '.Cloud',
  '.Data',
  '.Talent',
  '.Mobile',
  '.Web',
  '.Digital',
]

export default function LogoText() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-gray-800 font-bold text-sm h-6 overflow-hidden relative">
      <div
        className="transition-transform duration-500"
        style={{ transform: `translateY(-${currentIndex * 1.5}rem)` }}
      >
        {rotatingWords.map((word, idx) => (
          <div key={idx} className="h-6">
            {word}
          </div>
        ))}
      </div>
    </div>
  )
}
