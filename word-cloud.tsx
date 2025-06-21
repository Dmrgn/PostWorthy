import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface WordData {
  text: string
  frequency: number
}

interface WordCloudProps {
  words: WordData[]
  maxWords?: number
  colorScheme?: "blue" | "purple" | "green" | "rainbow"
}

export default function WordCloud({ words, maxWords = 50, colorScheme = "rainbow" }: WordCloudProps) {
  const [processedWords, setProcessedWords] = useState<
    (WordData & {
      fontSize: number
      color: string
      x: number
      y: number
    })[]
  >([])

  const colorSchemes = {
    blue: ["text-blue-400", "text-blue-500", "text-blue-600", "text-blue-700", "text-blue-800"],
    purple: ["text-purple-400", "text-purple-500", "text-purple-600", "text-purple-700", "text-purple-800"],
    green: ["text-green-400", "text-green-500", "text-green-600", "text-green-700", "text-green-800"],
    rainbow: [
      "text-red-500",
      "text-orange-500",
      "text-yellow-500",
      "text-green-500",
      "text-blue-500",
      "text-indigo-500",
      "text-purple-500",
      "text-pink-500",
    ],
  }

  useEffect(() => {
    if (!words.length) return

    // Sort words by frequency and take top maxWords
    const sortedWords = [...words].sort((a, b) => b.frequency - a.frequency).slice(0, maxWords)

    // Find min and max frequencies for scaling
    const maxFreq = Math.max(...sortedWords.map((w) => w.frequency))
    const minFreq = Math.min(...sortedWords.map((w) => w.frequency))

    // Container dimensions (approximate)
    const containerWidth = 400
    const containerHeight = 300

    // Function to estimate text dimensions
    const getTextDimensions = (text: string, fontSize: number) => {
      const avgCharWidth = fontSize * 0.6 // Approximate character width
      const width = text.length * avgCharWidth
      const height = fontSize * 1.2 // Line height
      return { width, height }
    }

    // Function to check if two rectangles overlap
    const isOverlapping = (rect1: any, rect2: any) => {
      return !(
        rect1.right < rect2.left ||
        rect2.right < rect1.left ||
        rect1.bottom < rect2.top ||
        rect2.bottom < rect1.top
      )
    }

    // Function to find a non-overlapping position using spiral pattern
    const findPosition = (word: any, placedWords: any[], fontSize: number) => {
      const { width, height } = getTextDimensions(word.text, fontSize)
      const centerX = containerWidth / 2
      const centerY = containerHeight / 2

      // Try center position first
      const bestX = centerX
      const bestY = centerY

      const createRect = (x: number, y: number) => ({
        left: x - width / 2,
        right: x + width / 2,
        top: y - height / 2,
        bottom: y + height / 2,
      })

      // Check if center position is free
      let currentRect = createRect(bestX, bestY)
      let hasCollision = placedWords.some((placed) => isOverlapping(currentRect, placed.rect))

      if (!hasCollision) {
        return { x: bestX, y: bestY, rect: currentRect }
      }

      // Spiral outward from center
      const maxRadius = Math.min(containerWidth, containerHeight) / 2 - Math.max(width, height) / 2
      const angleStep = 0.5 // Smaller step for more positions
      const radiusStep = 2

      for (let radius = radiusStep; radius < maxRadius; radius += radiusStep) {
        for (let angle = 0; angle < 360; angle += angleStep) {
          const radian = (angle * Math.PI) / 180
          const x = centerX + Math.cos(radian) * radius
          const y = centerY + Math.sin(radian) * radius

          // Check bounds
          if (
            x - width / 2 < 0 ||
            x + width / 2 > containerWidth ||
            y - height / 2 < 0 ||
            y + height / 2 > containerHeight
          ) {
            continue
          }

          currentRect = createRect(x, y)
          hasCollision = placedWords.some((placed) => isOverlapping(currentRect, placed.rect))

          if (!hasCollision) {
            return { x, y, rect: currentRect }
          }
        }
      }

      // Fallback to a safe position if no space found
      return {
        x: centerX,
        y: centerY + placedWords.length * 20,
        rect: createRect(centerX, centerY + placedWords.length * 20),
      }
    }

    // Process words with collision-free positioning
    const processed: any[] = []
    const colors = colorSchemes[colorScheme]

    sortedWords.forEach((word, index) => {
      // Scale font size based on frequency (16px to 48px)
      const normalizedFreq = (word.frequency - minFreq) / (maxFreq - minFreq)
      const fontSize = 16 + normalizedFreq * 32

      // Find non-overlapping position
      const position = findPosition(word, processed, fontSize)

      // Convert to percentage for CSS positioning
      const xPercent = (position.x / containerWidth) * 100
      const yPercent = (position.y / containerHeight) * 100

      const processedWord = {
        ...word,
        fontSize,
        color: colors[index % colors.length],
        x: Math.max(5, Math.min(95, xPercent)),
        y: Math.max(5, Math.min(95, yPercent)),
        rect: position.rect,
      }

      processed.push(processedWord)
    })

    setProcessedWords(processed)
  }, [words, maxWords, colorScheme])

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border mx-auto max-w-2xl">
      <div className="absolute inset-0 p-4">
        {processedWords.map((word, index) => (
          <motion.div
            key={`${word.text}-${index}`}
            className={`absolute cursor-pointer select-none font-semibold ${word.color} hover:opacity-80 transition-opacity`}
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              fontSize: `${word.fontSize}px`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.05,
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
            whileHover={{ scale: 1.1 }}
            title={`${word.text}: ${word.frequency} occurrences`}
          >
            {word.text}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        {processedWords.length} words displayed
      </div>
    </div>
  )
}

// Demo component with sample data
export function WordCloudDemo() {
  const sampleWords: WordData[] = [
    { text: "JavaScript", frequency: 95 },
    { text: "React", frequency: 87 },
    { text: "TypeScript", frequency: 78 },
    { text: "Next.js", frequency: 65 },
    { text: "CSS", frequency: 82 },
    { text: "HTML", frequency: 90 },
    { text: "Node.js", frequency: 58 },
    { text: "Python", frequency: 72 },
    { text: "API", frequency: 45 },
    { text: "Database", frequency: 52 },
    { text: "Frontend", frequency: 68 },
    { text: "Backend", frequency: 55 },
    { text: "Framework", frequency: 42 },
    { text: "Component", frequency: 38 },
    { text: "State", frequency: 35 },
    { text: "Props", frequency: 33 },
    { text: "Hook", frequency: 40 },
    { text: "Router", frequency: 28 },
    { text: "Server", frequency: 48 },
    { text: "Client", frequency: 44 },
    { text: "Build", frequency: 36 },
    { text: "Deploy", frequency: 32 },
    { text: "Test", frequency: 41 },
    { text: "Debug", frequency: 29 },
    { text: "Performance", frequency: 37 },
    { text: "Optimization", frequency: 31 },
    { text: "Security", frequency: 34 },
    { text: "Authentication", frequency: 26 },
    { text: "Authorization", frequency: 24 },
    { text: "Middleware", frequency: 22 },
  ]

  const [colorScheme, setColorScheme] = useState<"blue" | "purple" | "green" | "rainbow">("rainbow")

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Dynamic Word Cloud</h1>
        <p className="text-gray-600">Interactive visualization of word frequencies</p>
      </div>

      <div className="flex justify-center gap-2">
        {(["rainbow", "blue", "purple", "green"] as const).map((scheme) => (
          <button
            key={scheme}
            onClick={() => setColorScheme(scheme)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              colorScheme === scheme ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
          </button>
        ))}
      </div>

      <WordCloud words={sampleWords} colorScheme={colorScheme} />

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="space-y-1">
          <li>• Words sized by frequency (larger = more frequent)</li>
          <li>• Hover effects and tooltips showing exact counts</li>
          <li>• Animated entrance with staggered timing</li>
          <li>• Multiple color schemes available</li>
          <li>• Responsive positioning algorithm</li>
        </ul>
      </div>
    </div>
  )
}
